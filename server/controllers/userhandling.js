import express from 'express';
import db from '../db.js';
import service from "../services/appointment.service.js"; // Replace with your actual DB connection module

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await db.query('SELECT * FROM users');  // Adjust the query to your DB schema
            res.json({users: result.rows});
        } catch (err) {
            console.error('Error reading users:', err.message);
            res.status(500).json({error: 'Error reading users'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

router.get('/admin', (req, res) => {
    // Ensure the user is authenticated and role is admin
    if (req.user && req.user.role === 'admin') {
        res.json({isAdmin: true}); // Respond with true if the user is an admin
    } else {
        res.status(403).json({message: 'Access denied. Admins only.'}); // Return 403 if not authorized
    }
});

router.get('/verify', (req, res) => {
    // Ensure the user is authenticated and role is admin
    if (req.user) {
        res.json({isUser: true}); // Respond with true if the user is an admin
    } else {
        res.status(403).json({message: 'Access denied. Userss only.'}); // Return 403 if not authorized
    }
});


// UPDATE a user by ID
router.put('/update/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {firstname, email, phone_number, lastname, address} = req.body; // Use firstName here
        try {
            const query = 'UPDATE users SET firstname=$1, email = $2, phone_number = $3, lastname=$5, address=$6 WHERE id = $4 RETURNING *';
            const params = [firstname, email, phone_number, id, lastname, address]; // Pass firstName here
            const result = await db.query(query, params);
            if (result.rows.length) {
                res.status(200).json({user: result.rows[0]});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (err) {
            console.error('Error updating user:', err.message);
            res.status(500).json({error: 'Error updating user'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// In your Express router file (e.g., userRoutes.js)
router.get("/profile", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (!req.isAuthenticated()) {
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({message: "Server error"});
    }
});


// DELETE a user by ID
router.delete('/delete/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        try {
            const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
            if (result.rowCount > 0) {
                res.status(200).json({message: 'User deleted'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (err) {
            console.error('Error deleting user:', err.message);
            res.status(500).json({error: 'Error deleting user'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

router.post('/confirm', async (req, res, next) => {
    console.log('Request received at /confirm');

    if (req.isAuthenticated()) {
        console.log('User is authenticated');

        try {
            const uid = req.user.id;
            const {appointmentData, serviceIds, time_numbers} = req.body;

            // Ensure the required data is present
            if (!appointmentData || !Array.isArray(serviceIds) || !Array.isArray(time_numbers)) {
                return res.status(400).json({message: 'Invalid input data'});
            }

            // Create the appointment
            const appointmentId = await service.addAppointment(appointmentData, uid);

            // Add services and time slots to the appointment
            await service.addAppointmentServices(appointmentId, serviceIds);

            await service.addAppointmentTimeSlots(appointmentId, time_numbers);

            res.status(201).json({appointmentId});
        } catch (error) {
            console.error('Error occurred:', error);
            next(error);
        }
    } else {
        console.log('User is not authenticated');
        res.status(401).json({message: 'Unauthorized'});
    }
});

router.get('/status/:appointmentId', async (req, res) => {
    if (req.isAuthenticated()) {
        const {appointmentId} = req.params;
        try {
            const status = await service.getAppointmentStatus(appointmentId);

            if (status) {
                res.json(status);
            } else {
                res.status(404).json({error: 'Appointment not found'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error fetching appointment status'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

router.delete('/delete/:appointmentId', async (req, res) => {
    if (req.isAuthenticated()) {
        const {appointmentId} = req.params;

        // Ensure the appointmentId is provided
        if (!appointmentId) {
            return res.status(400).json({message: 'Appointment ID is required'});
        }

        try {
            // Delete related services and time slots first
            await db.query('DELETE FROM appointment_services WHERE appointment_id = $1', [appointmentId]);
            await db.query('DELETE FROM appointment_time_slots WHERE appointment_id = $1', [appointmentId]);

            // Then delete the appointment
            await db.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);

            res.status(200).json({message: 'Appointment deleted successfully'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error deleting appointment'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


export default router;
