import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from 'cors';
import db from './db.js';
import userManagementController from "./controllers/userManagement.js";
import crudController from "./controllers/crudcontrollers.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import employeeRoutes from './controllers/employee.controller.js';
import UserH from './controllers/userhandling.js';
import beautyServicesRoutes from './controllers/beautyService.controller.js';
import professionalRoutes from './controllers/professional.controller.js';
import appointmentRoutes from './controllers/appointment.controller.js';
import appointmentDetailsRoutes from './controllers/appointment.controller.js';
import appointmentStatusRoutes from './controllers/appointment.controller.js';
import appointmentConfirmedRoutes from './controllers/appointment.controller.js';
import appointmentRejectedRoutes from './controllers/appointment.controller.js';
import appointmentDeleteRoutes from './controllers/appointment.controller.js';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 10, // 10 minutes
            httpOnly: false,
            secure: false
        },
        name: 'diamond'
    })
);
// Middleware
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/beautyservices', beautyServicesRoutes);
app.use('/api/selectprofessional', professionalRoutes);
app.use('/api/appointmentservice', appointmentRoutes);
app.use('/api/appointmentdetails', appointmentDetailsRoutes);
app.use('/api/appointmentstatus', appointmentStatusRoutes);
app.use('/api/appointmentconfirmed', appointmentConfirmedRoutes);
app.use('/api/appointmentrejected', appointmentRejectedRoutes);
app.use('/api/appointmentdelete', appointmentDeleteRoutes)


app.use(ErrorHandler)

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(ErrorHandler);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/employees", employeeRoutes);
app.use("/", userManagementController);
app.use('/api/crud', crudController);
app.use('/api/user', UserH);


// app.use("/api/ai", aiController); // Updated route for AiManagement

app.get("/", (req, res) => {
    res.redirect("http://localhost:3000/home");
});

// Error handling middleware should be last
// First, make sure the DB connection is successful, then start the express server.
db.query("SELECT 1")
    .then(() => {
        console.log('DB connection succeeded.');
    })
    .catch(err => console.log('DB connection failed.\n' + err));


app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
