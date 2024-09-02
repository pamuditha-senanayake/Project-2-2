import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import db from "../db.js";  // Import the db client from db.js
import env from "dotenv";

env.config();

const router = express.Router();

const saltRounds = 10;

router.get("/login", (req, res) => {
  res.redirect("http://localhost:3000/");
});

router.get("/register", (req, res) => {
  res.redirect("http://localhost:3000/register");
});

router.post("/register", async (req, res) => {
  const { username: email, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, hash]);
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.error("Login error:", err);
            } else {
              res.redirect("/crud");
            }
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "http://localhost:3000/home",
  failureRedirect: "http://localhost:3000/admin-users",
}));

// router.get("/logout", (req, res) => {
//   req.logout(err => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the error handler middleware
    }

    // Clear the cookie
    res.clearCookie('diamond', { path: '/' }); // Adjust the cookie name and path as needed

    // Redirect to React app
    res.redirect('http://localhost:3000/');
  });
});


passport.use("local", new LocalStrategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    } else {
      return cb("User not found");
    }
  } catch (err) {
    console.log(err);
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
