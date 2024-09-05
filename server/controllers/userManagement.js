import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import db from "../db.js";
import env from "dotenv";
import {GoogleGenerativeAI} from '@google/generative-ai';

env.config();

const router = express.Router();
const saltRounds = 10;

router.get("/", (req, res) => {
    res.redirect("http://localhost:3000/");
});

router.get("/register", (req, res) => {
    res.redirect("http://localhost:3000/register");
});

router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rows.length > 0) {
            res.status(400).json({message: "User already exists"}); // Respond with an error if user exists
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password:", err);
                    res.status(500).json({message: "Server error during registration"});
                } else {
                    const result = await db.query(
                        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
                        [email, hash]
                    );
                    const user = result.rows[0];

                    req.login(user, (err) => {
                        if (err) {
                            res.status(500).json({message: "Login failed after registration"});
                        } else {
                            res.json({message: "Registration successful", user}); // Return success response
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"}); // Send an error message to the frontend
    }
});


// router.post("/login", passport.authenticate("local", {
//     successRedirect: "http://localhost:3000/home",
//     failureRedirect: "http://localhost:3000/admin-users",
// }));


const roleRedirect = async (req, res, next) => {
    // Debugging log
    // console.log('User object:', req.user);

    if (req.user) {
        try {
            const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                // console.log('User role:', user.role); // Debugging log

                // Redirect based on user role
                if (user.role === 'admin') {
                    return res.redirect('http://localhost:3000/admin-users');
                } else if (user.role === 'customer') {
                    return res.redirect('http://localhost:3000/home');
                } else {
                    // Default redirection if role is unknown
                    return res.redirect('http://localhost:3000/home');
                }
            } else {
                console.log('User not found in database'); // Debugging log
                return res.redirect('http://localhost:3000/');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            return res.redirect('http://localhost:3000/');
        }
    } else {
        console.log('No user found in request'); // Debugging log
        return res.redirect('http://localhost:3000/');
    }
};


router.post("/login",
    passport.authenticate("local", {session: true}), // Disable session management for stateless authentication
    roleRedirect // Add roleRedirect middleware after passport.authenticate
);


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.clearCookie('diamond', {path: '/'});
        res.redirect('http://localhost:3000/');
    });
});

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);


// router.get(
//     "/auth/google/secrets",
//     passport.authenticate("google", {
//         successRedirect: "http://localhost:3000/home",
//         failureRedirect: "http://localhost:3000/",
//     })
// );

router.get(
    "/auth/google/secrets",
    passport.authenticate("google", {session: true}), // Disable session management for stateless authentication
    roleRedirect // Add roleRedirect middleware after passport.authenticate
);

passport.use("local", new LocalStrategy(async (username, password, cb) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [username]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(user);
            const valid = await bcrypt.compare(password, user.password);

            if (valid) {
                return cb(null, user);
            } else {
                return cb(null, false, {message: 'Incorrect password'});
            }
        } else {
            return cb(null, false, {message: 'User not found'});
        }
    } catch (err) {
        console.log(err);
        return cb(err);
    }
}));

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/google/secrets",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                // Log profile object to debug
                // console.log("Google profile:", profile);

                // Extract email from profile
                const email = profile.email || (profile.emails && profile.emails[0].value);

                if (!email) {
                    return cb(new Error("Email not found in profile"), null);
                }

                const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

                if (result.rows.length === 0) {
                    // Insert new user with a placeholder password
                    const newUser = await db.query(
                        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
                        [email, "google"]
                    );

                    return cb(null, newUser.rows[0]);
                } else {
                    return cb(null, result.rows[0]);
                }
            } catch (err) {
                console.error("Error in GoogleStrategy verification:", err);
                return cb(err);
            }
        }
    )
);


passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));


const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Hotel information
const salonDescription = [
    "Welcome to Salon Diamond, nestled in the charming city of Kandy, Sri Lanka.",
    "Our salon offers a range of luxurious beauty treatments and hair services tailored to your needs.",
    "Experience top-notch services from our skilled team of professionals dedicated to making you look and feel your best.",
    "Enjoy a relaxing atmosphere with elegant decor and premium products used in all our treatments.",
    "Salon Diamond is committed to providing exceptional service and personalized care to ensure a delightful experience.",
    "Whether you're preparing for a special occasion or just need a pampering session, Salon Diamond is your go-to destination for beauty and relaxation.",
    "Our team is here to help you achieve the perfect look with precision and style, making every visit memorable.",
    "this is a description of a salon. if any questions asked try to answer from given text. If there's no info provided, respond as 'No info'. If there is, respond in less than 20 words with simple, direct answers."
];

// Route to handle user queries
router.post('/ask', async (req, res) => {
    console.log('Received request body:', req.body); // Log incoming request body
    console.log('Received request for /api/ask');

    const {message} = req.body;

    if (message.toLowerCase().trim() === 'exit') {
        res.json({response: "Chatbot session ended."});
        return;
    }

    try {
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

        const chatHistory = [
            {
                role: "user",
                parts: [{text: message}],
            },
            {
                role: "model",
                parts: salonDescription.map(text => ({text}))
            },
        ];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log('Chatbot response:', text); // Log response text
        res.json({response: text});
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({response: 'Error generating response'});
    }
});


export default router;
