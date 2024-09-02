import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import db from "../db.js";
import env from "dotenv";

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
  const { email, password, firstName, lastName } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      try {
        console.log("Inserting user data:", email, hash, firstName, lastName);

        const result = await db.query(
            "INSERT INTO users (email, password, firstName, lastName) VALUES ($1, $2, $3, $4) RETURNING *",
            [email, hash, firstName, lastName]
        );

        const user = result.rows[0];
        console.log("Inserted user:", user);

        req.login(user, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Error logging in" });
          }

          res.status(201).json({ message: "Registration successful" });
        });
      } catch (dbErr) {
        console.error("Database error:", dbErr.message, dbErr.stack);
        res.status(500).json({ message: "Error saving user to database" });
      }
    });
  } catch (err) {
    console.error("Error during registration:", err.message, err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.post("/login", passport.authenticate("local", {
  successRedirect: "http://localhost:3000/home",
  failureRedirect: "http://localhost:3000/admin-users",
}));

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie('diamond', { path: '/' });
    res.redirect('http://localhost:3000/');
  });
});

passport.use("local", new LocalStrategy(async (username, password, cb) => {
  try {
    const result = await db.query(
        "SELECT password FROM users WHERE email = $1",
        [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password);

      if (valid) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: 'Incorrect password' });
      }
    } else {
      return cb(null, false, { message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    return cb(err);
  }
}));

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
    if (result.rows.length === 0) {
      const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [profile.email, "google"]);
      return cb(null, newUser.rows[0]);
    } else {
      return cb(null, result.rows[0]);
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

export default router;
