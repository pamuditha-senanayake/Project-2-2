import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from 'cors';
import userManagementController from "./controllers/userManagement.js";
import aiController from "./controllers/AiManagement.js";
import crudController from "./controllers/crudcontrollers.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import employeeRoutes from './controllers/employee.controller.js';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 10, // 10 minutes
            httpOnly: false
        },
        name: 'diamond'
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/employees", employeeRoutes);
app.use("/", userManagementController);
app.use("/api/crud", crudController);
// app.use("/api/ai", aiController); // Updated route for AiManagement

app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/home");
});

// Error handling middleware should be last
app.use(ErrorHandler);

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
