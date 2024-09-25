import express from 'express';
import db from '../db.js';
import service from "../services/appointment.service.js"; // Replace with your actual DB connection module
import cartService from "../services/cartService.js"; // Replace with your actual DB connection module
import checkoutService from '../services/checkoutService.js';

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

router.delete('/delete', async (req, res) => {
    console.log("DELETE request received");

    if (req.isAuthenticated()) {
        const {appointmentId} = req.query;  // Fetch the appointmentId from the query parameters

        console.log(`Authenticated user attempting to delete appointment with ID: ${appointmentId}`);

        // Ensure the appointmentId is provided
        if (!appointmentId) {
            console.error('Appointment ID is missing');
            return res.status(400).json({message: 'Appointment ID is required'});
        }

        try {
            // Delete related services and time slots first
            console.log(`Deleting services for appointment ID: ${appointmentId}`);
            const deleteServicesResult = await db.query('DELETE FROM appointment_services WHERE appointment_id = $1', [appointmentId]);
            console.log('Services deleted:', deleteServicesResult.rowCount);

            console.log(`Deleting time slots for appointment ID: ${appointmentId}`);
            const deleteTimeSlotsResult = await db.query('DELETE FROM appointment_time_slots WHERE appointment_id = $1', [appointmentId]);
            console.log('Time slots deleted:', deleteTimeSlotsResult.rowCount);

            // Then delete the appointment
            console.log(`Deleting appointment with ID: ${appointmentId}`);
            const deleteAppointmentResult = await db.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);
            console.log('Appointment deleted:', deleteAppointmentResult.rowCount);

            res.status(200).json({message: 'Appointment deleted successfully'});
        } catch (err) {
            console.error('Error during deletion:', err);
            res.status(500).json({error: 'Error deleting appointment'});
        }
    } else {
        console.error('Unauthorized request: user not authenticated');
        res.status(401).json({error: 'Unauthorized'});
    }
});


//cart
//add to cart

router.put("/cartadd", async (req, res) => {
    //res.setHeader('Cache-Control', 'no-store'); // Disable caching
    if (!req.isAuthenticated()) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const {  itemId, quantity } = req.body;
    try {
        const updatedItem = await cartService.addOrUpdateItem(req.user.id, itemId, quantity);
        res.json(updatedItem);
        console.log(req.user.id);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({message: "Server error"});
    }
});


// // Get cart items for a specific user

router.get('/cartget', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userId = req.user.id;
            const cartItems = await cartService.getCartItems(userId);
            res.json(cartItems);

        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error reading records'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});router.put('/update/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;
    let { quantity } = req.body;

    // Ensure quantity is a valid number and at least 1
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a valid number and at least 1' });
    }

    try {
        const query = 'UPDATE cart SET quantity = $1 WHERE cart_id = $2 RETURNING *';
        const params = [quantity, cartItemId];
        const result = await db.query(query, params);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Cart item updated', cartItem: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Cart item not found' });
        }
    } catch (err) {
        // Log the error more descriptively
        console.error('Error updating cart item:', err);
        res.status(500).json({ error: 'Error updating cart item' });
    }
});
// DELETE a cart item by cart_id
router.delete('/remove/:cart_id', async (req, res) => {
    const { cart_id } = req.params;

    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Delete the cart item by cart_id
        const result = await db.query('DELETE FROM cart WHERE cart_id = $1', [cart_id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Cart item removed' });
        } else {
            res.status(404).json({ error: 'Cart item not found' });
        }
    } catch (error) {
        console.error('Error removing cart item:', error.message);
        res.status(500).json({ error: 'Error removing cart item' });
    }
});
router.put("/checkout", async (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Debug user authentication
        if (req.user && req.user.id) {
            console.log("User authenticated. User ID:", req.user.id); // Log authenticated user
        } else {
            console.error("User authentication failed. req.user is undefined or lacks an id.");
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extract shipping details and cart items from the request body
        const { shippingDetails, cartItems } = req.body;
        console.log("Shipping details received:", shippingDetails); // Debug shipping details
        console.log("Cart items received:", cartItems); // Debug cart items

        try {
            // Log before calling the service
            console.log("Calling cartService.addOrUpdateItem with User ID:", req.user.id);

            // Call service to add or update items
            const result = await checkoutService.checkout(req.user.id, shippingDetails, cartItems);

            // Send response to client
            res.json(result);

            // Log success
            console.log("Checkout successful for User ID:", req.user.id);

        } catch (error) {
            // Log error details
            console.error("Error during checkout for User ID:", req.user.id, "Error:", error.message);

            // Send error response
            res.status(500).json({ message: "Server error" });
        }
    } else {
        // User not authenticated
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// router.post('/', async (req, res) => {
//     const { shippingDetails, cartItems } = req.body;
//     const userId = 1; // Replace with authentication logic
//
//     try {
//         const result = await checkoutService.checkout(userId, shippingDetails, cartItems);
//         res.json(result);
//     } catch (err) {
//         console.error('Error during checkout:', err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

//Get all user shipping details
// router.get('/orders', async (req, res) => {
//     if (req.isAuthenticated()) {
//         try {
//             const result = await db.query('SELECT * FROM orders');  // Adjust the query to your DB schema
//             res.json({users: result.rows});
//         } catch (err) {
//             console.error('Error reading users:', err.message);
//             res.status(500).json({error: 'Error reading users'});
//         }
//     } else {
//         res.status(401).json({error: 'Unauthorized'});
//     }
// });
router.get('/orders', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await db.query('SELECT * FROM orders');  // Adjust the query to your DB schema
            res.json(result.rows);  // Return the rows directly as an array
        } catch (err) {
            console.error('Error reading orders:', err.message);
            res.status(500).json({ error: 'Error reading orders' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


export default router;
