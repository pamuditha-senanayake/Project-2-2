import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";
import userManagementController from "./controllers/userManagement.js";
import crudController from "./controllers/crudcontrollers.js";
import 'express-async-errors';
import ErrorHandler from "./middlewares/ErrorHandler.js";
import db from './db.js';
import employeeRoutes from './controllers/employee.controller.js';
import userPM from './controllers/userManagement.js';

const app = express();
const port = 3001;
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 10, // 10 minutes (in milliseconds)
            httpOnly: false
        },
        name: 'diamond'
    })
);



// Middleware
app.use('/api/employees', employeeRoutes);
app.use(ErrorHandler)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", userManagementController);
app.use("/", crudController);

app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/home");
});

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// First, make sure the DB connection is successful, then start the express server.
// db.query("SELECT 1")
//     .then(() => {
//         console.log('DB connection succeeded.');
//         app.listen(3000, () => console.log('Server started at port 3000'));
//     })
//     .catch(err => console.log('DB connection failed.\n' + err));