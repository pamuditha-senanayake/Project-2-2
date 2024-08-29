import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';
import ErrorHandler from "./middlewares/ErrorHandler.js";

import db from './db.js';
import employeeRoutes from './controllers/employee.controller.js';
import userPM from './controllers/userManagement.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userPM);
app.use(ErrorHandler)


// First, make sure the DB connection is successful, then start the express server.
db.query("SELECT 1")
    .then(() => {
        console.log('DB connection succeeded.');
        app.listen(3000, () => console.log('Server started at port 3000'));
    })
    .catch(err => console.log('DB connection failed.\n' + err));


