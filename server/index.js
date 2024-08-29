import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';
import cors from 'cors';
import db from './db.js';
import ErrorHandler from "./middlewares/ErrorHandler.js";
import employeeRoutes from './controllers/employee.controller.js';
import beautyServicesRoutes from './controllers/beautyService.controller.js';
import professionalRoutes from './controllers/professional.controller.js';

// import userPM from './controllers/userManagement.js';

const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/beautyservices', beautyServicesRoutes);
app.use('/api/selectprofessional', professionalRoutes);
// app.use('/api/users', userPM);
app.use(ErrorHandler)


// First, make sure the DB connection is successful, then start the express server.
db.query("SELECT 1")
    .then(() => {
        console.log('DB connection succeeded.');
        app.listen(3001, () => console.log('Server started at port 3001'));
    })
    .catch(err => console.log('DB connection failed.\n' + err));


