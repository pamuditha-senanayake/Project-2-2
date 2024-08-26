import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*60*10, //2 minute (mili second)
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.get("/crud", async (req, res) => {
  //console.log(req.user);
  if (req.isAuthenticated()) {
    try {
      const result = await db.query(
        `SELECT * FROM hours WHERE uid = $1`,
        [req.user.id]
      );
      //console.log(result);
      const hours = result.rows;
      if (hours.length > 0) {
        res.render("crud.ejs", { hours: hours });
      } else {
        res.render("crud.ejs", { hours: [] });
      }
    } catch (err) {
      console.log(err);
      res.render("crud.ejs", { hours: "reading error" });
    }
  } else {
    res.redirect("/login");
  }
});


app.get("/deletecrud/:id", async (req, res) => {
  const { id } = req.params;
  if (req.isAuthenticated()) {
    try {
      await db.query(
        `DELETE FROM hours WHERE id = $1`,
        [id]
      );
      res.redirect("/crud");
    } catch (err) {
      console.log(err);
      res.send("Error deleting record.");
    }
  } else {
    res.redirect("/login");
  }
});

// Display update form
app.get("/updatecrud/:id", async (req, res) => {
  const { id } = req.params;
  if (req.isAuthenticated()) {
    try {
      const result = await db.query(
        `SELECT * FROM hours WHERE id = $1`,
        [id]
      );
      const hour = result.rows[0];
      if (hour) {
        res.render("update.ejs", { hour: hour });
      } else {
        res.send("Record not found.");
      }
    } catch (err) {
      console.log(err);
      res.send("Error fetching record.");
    }
  } else {
    res.redirect("/login");
  }
});

// Handle update form submission
app.post("/updatecrud/:id", async (req, res) => {
  const { id } = req.params;
  const { hours, place } = req.body;
  if (req.isAuthenticated()) {
    try {
      await db.query(
        `UPDATE hours SET hours = $1, place = $2 WHERE id = $3`,
        [hours, place, id]
      );
      res.redirect("/crud");
    } catch (err) {
      console.log(err);
      res.send("Error updating record.");
    }
  } else {
    res.redirect("/login");
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});



app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/crud",
    failureRedirect: "/login",
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/crud",
    failureRedirect: "/login",
  })
);

app.post("/crudsubmit", async function (req, res) {
  const hours = req.body.hours;
  const place = req.body.place;
  //console.log(req.user);
  try {
    await db.query(
      `INSERT INTO hours (uid, hours, place) VALUES ($1, $2, $3)`,
      [req.user.id, hours, place]
    );

    res.redirect("/crud");
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];

          req.login(user, (err) => {
            console.log("success");
            res.redirect("/crud");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];

        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);

        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );

          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
