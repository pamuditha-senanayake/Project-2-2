import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import db from "../db.js";
import env from "dotenv";
import {GoogleGenerativeAI} from '@google/generative-ai';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

env.config();

const router = express.Router();
const saltRounds = 10;


router.post('/forgot-password', async (req, res) => {
    console.log("Received request for /forgot-password");
    const {email} = req.body;

    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({message: "User not found"});
        }

        const user = userResult.rows[0];

        // Generate a unique token and set expiration time (1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000);  // 1 hour

        // Save the reset token and expiration to the database (use user's id)
        await db.query(
            "UPDATE users SET reset_password_token = $1, reset_password_expiration = $2 WHERE id = $3",
            [resetToken, resetTokenExpiration, user.id]
        );

        // Create a reset link (assuming your frontend will handle the token)
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send an email with the reset link (using Nodemailer or any other email service)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            secure: true,
            port: 465,
            // logger: true, // Enable logger
            // debug: true   // Enable debug
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click this link to reset your password: ${resetLink}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({message: "Password reset link sent to your email"});
        } catch (err) {
            console.error("Error sending email:", err);
            res.status(500).json({message: "Error sending reset email"});
        }

    } catch (err) {
        console.error("Error processing forgot password request:", err);
        res.status(500).json({message: "Server error"});
    }
});

router.post('/reset-password', async (req, res) => {
    const {token, password} = req.body; // Extract the token and password from the request body

    console.debug(`Reset password request received. Token: ${token}, Password: ${password}`);

    if (!token) {
        console.error('Token is missing');
        return res.status(400).json({message: 'Token is missing'});
    }

    try {
        // Query to check if the token is valid and not expired
        const result = await db.query(
            "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expiration > NOW()",
            [token]
        );

        console.debug(`Database query result: ${JSON.stringify(result.rows)}`);

        if (result.rows.length === 0) {
            console.warn('Invalid or expired token');
            return res.status(400).json({message: 'Invalid or expired token'});
        }

        const user = result.rows[0];
        console.debug(`User found: ${JSON.stringify(user)}`);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.debug(`Hashed password: ${hashedPassword}`);

        // Update user's password in the database and clear the reset token
        await db.query(
            "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiration = NULL WHERE id = $2",
            [hashedPassword, user.id]
        );

        console.debug(`Password updated for user ID: ${user.id}`);

        res.json({message: 'Password has been reset successfully'});

    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({message: 'Server error'});
    }
});
router.get("/", (req, res) => {
    res.redirect("http://localhost:3000/");
});

router.get("/register", (req, res) => {
    res.redirect("http://localhost:3000/register");
});

router.post("/register", async (req, res) => {
    const {email, password, role} = req.body;

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
                        "INSERT INTO users (email, password, role, date) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *",
                        [email, hash, role]
                    );
                    console.log(result);
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
    if (req.user) {
        try {
            const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);

            if (result.rows.length > 0) {
                const user = result.rows[0];

                if (user.role === 'admin') {
                    return res.redirect('http://localhost:3000/adminhome');
                } else if (user.role === 'customer') {
                    return res.redirect('http://localhost:3000/home');
                } else {
                    return res.redirect('http://localhost:3000/home');
                }
            } else {
                console.log('User not found in database');
                return res.redirect('http://localhost:3000/');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            return res.redirect('http://localhost:3000/');
        }
    } else {
        console.log('No user found in request');
        return res.redirect('http://localhost:3000/');
    }
};


// Route to fetch user role
router.get('/role', async (req, res) => {
    if (req.user) {
        try {
            const result = await db.query("SELECT role FROM users WHERE id = $1", [req.user.id]);

            if (result.rows.length > 0) {
                return res.json({user: {role: result.rows[0].role}});
            } else {
                return res.status(404).json({message: 'User not found'});
            }
        } catch (err) {
            console.error('Error fetching user role:', err);
            return res.status(500).json({message: 'Internal server error'});
        }
    } else {
        return res.status(401).json({message: 'Not authenticated'});
    }
});

router.put('/resetu', async (req, res) => {
    console.log('Reset Password Endpoint Hit'); // Log when the endpoint is accessed

    if (req.isAuthenticated()) {
        console.log('User is authenticated'); // Log if the user is authenticated

        const {password} = req.body;
        console.log('Received Password:', password); // Log the received password

        if (!password) {
            console.log('Password is missing'); // Log if password is not provided
            return res.status(400).json({message: 'Password is required'});
        }

        try {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashed Password:', hashedPassword); // Log the hashed password

            const userId = req.user.id; // Get the logged-in user ID from the session
            console.log('User ID:', userId); // Log the user ID

            // Fetch user from the database
            const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
            const user = result.rows[0]; // Get the user object
            console.log('User Found:', user); // Log the user found

            if (!user) {
                console.log('User not found'); // Log if user is not found
                return res.status(404).json({message: 'User not found'});
            }

            // Update user's password
            await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
            console.log('Password updated successfully'); // Log success message

            res.status(200).json({message: 'Password updated successfully'});
        } catch (error) {
            console.error('Error resetting password:', error); // Log the error
            res.status(500).json({message: 'Server error'});
        }
    } else {
        console.log('User is unauthorized'); // Log if the user is unauthorized
        res.status(401).json({error: 'Unauthorized'});
    }
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            // If authentication fails, clear cookies and redirect to the login page
            res.clearCookie('diamond');
            return res.redirect('http://localhost:3000/');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return roleRedirect(req, res, next); // Call roleRedirect after successful login
        });
    })(req, res, next);
});


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
    passport.authenticate("google", {session: true}),
    roleRedirect
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
                //console.log("Google profile:", profile);

                // Extract email from profile
                const email = profile.email || (profile.emails && profile.emails[0].value);

                if (!email) {
                    return cb(new Error("Email not found in profile"), null);
                }

                const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

                if (result.rows.length === 0) {
                    // Insert new user with a placeholder password
                    const newUser = await db.query(
                        "INSERT INTO users (email, password,date) VALUES ($1, $2,CURRENT_DATE) RETURNING *",
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


router.post('/predict-registrations', async (req, res) => {
    const {userRegistrationData} = req.body;

    console.log('Received request to predict registrations with data:', userRegistrationData);

    if (!userRegistrationData) {
        console.error('Error: Missing user registration data');
        return res.status(400).json({error: 'Missing user registration data'});
    }

    try {
        const message = `Predict the future growth of user registrations based on the following data:\n${JSON.stringify(userRegistrationData)} and provide suggestions for a social media manager to optimize growth. **Don't make mathematical explanations, just give basic predictions and mostly give suggestions like run fb ads and all.**`;
        console.log('Generated message for AI model:', message);

        const model = genAI.getGenerativeModel({model: 'gemini-pro'});

        // Start the chat
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{text: message}],
                }
            ],
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            }
        });

        // Send the message
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log('Received response from AI model:', text);

        // Assuming the AI response is in bullet points with newline separators
        const lines = text.split('\n');

        let prediction = "";
        let peakSeasons = [];
        const suggestions = {
            advertising: [],
            content: [],
            engagement: [],
            other: [],
        };

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('*')) {
                const item = trimmedLine.slice(1).trim();
                if (item.includes("Growth Prediction") || item.includes("Overall Growth")) {
                    prediction = item;
                } else if (item.includes('peak seasons') || item.includes('peak months')) {
                    peakSeasons.push(item);
                } else {
                    const suggestion = item.trim();
                    let category = "other";
                    if (suggestion.includes('Facebook ads')) {
                        category = "advertising";
                    } else if (suggestion.includes('influencers')) {
                        category = "engagement";
                    } else if (suggestion.includes('contests')) {
                        category = "content";
                    }
                    suggestions[category].push(suggestion);
                }
            }
        }

        // Update the structured prediction object
        const structuredPrediction = {
            growthTrend: prediction,
            peakSeasons: peakSeasons,
            suggestions: suggestions,
        };

        res.json({prediction: structuredPrediction});
    } catch (error) {
        console.error('Error fetching prediction:', error);
        res.status(500).json({error: 'Error generating prediction'});
    }
});


export default router;
