import express from 'express';
import db from '../db.js';
import service from "../services/appointment.service.js"; // Replace with your actual DB connection module
import cartService from "../services/cartService.js"; // Replace with your actual DB connection module
import checkoutService from '../services/checkoutService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Change to your desired upload folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Append date to filename
    }
});

// Initialize upload
const upload = multer({storage});

router.put('/api/user/update/pic', upload.single('pic'), async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userId = req.user.id; // Get user ID from the authenticated request
            console.log('Authenticated User ID:', userId); // Debug log for user ID

            if (req.file && req.file.buffer) {
                console.log('Received file:', req.file); // Debug log for received file
                const fileName = `${userId}.png`; // Create a filename with user ID
                console.log('File will be saved as:', fileName); // Debug log for filename

                // Write the file to the specified directory
                fs.writeFileSync(`src/images/${fileName}`, req.file.buffer);
                console.log('File saved successfully to src/images/'); // Confirmation log

                // Update the user's profile picture in the database
                const query = 'UPDATE users SET pic = $1 WHERE id = $2';
                const values = [fileName, userId];
                console.log('Executing query:', query, 'with values:', values); // Debug log for query execution

                const result = await db.query(query, values);

                if (result.rowCount === 0) {
                    console.log('No user found with the provided ID.'); // Log if user not found
                    return res.status(404).json({message: 'User not found'});
                }

                // Fetch updated user data
                const updatedUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
                console.log('Updated user data:', updatedUser.rows[0]); // Debug log for updated user data

                return res.status(200).json({user: updatedUser.rows[0]});
            } else {
                console.log('No image file provided in the request.'); // Log if no file is provided
                return res.status(400).json({message: 'Image file not provided'});
            }
        } catch (error) {
            console.error('Error updating user picture:', error); // Log the error
            return res.status(500).json({message: 'Server error'});
        }
    } else {
        console.log('Unauthorized access attempt.'); // Log for unauthorized access
        return res.status(401).json({error: 'Unauthorized'});
    }
});


router.get('/customer', (req, res) => {
    // Ensure the user is authenticated and role is admin
    if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
        res.json({isUser: true}); // Respond with true if the user is an admin
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
// router.put('/update/:id', async (req, res) => {
//     if (req.isAuthenticated()) {
//         const {id} = req.params;
//         const {firstname, email, phone_number, lastname, address, role} = req.body; // Use firstName here
//         try {
//             const query = 'UPDATE users SET firstname=$1, email = $2, phone_number = $3, lastname=$5, address=$6, role=$7 WHERE id = $4 RETURNING *';
//             const params = [firstname, email, phone_number, id, lastname, address, role]; // Pass firstName here
//             const result = await db.query(query, params);
//             // console.log(result);
//             if (result.rows.length) {
//                 res.status(200).json({user: result.rows[0]});
//             } else {
//                 res.status(404).json({error: 'User not found'});
//             }
//         } catch (err) {
//             console.error('Error updating user:', err.message);
//             res.status(500).json({error: 'Error updating user'});
//         }
//     } else {
//         res.status(401).json({error: 'Unauthorized'});
//     }
// });

router.put('/update/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {firstname, email, phone_number, lastname, address, role} = req.body;
        console.log(firstname, email, phone_number, lastname, address, role);

        try {
            const query = `
                UPDATE users 
                SET firstname = $1, 
                    email = $2, 
                    phone_number = $3, 
                    lastname = $4,
                    address = $5
                WHERE id = $6 
                RETURNING *`;
            const params = [firstname, email, phone_number, lastname, address, id];

            const result = await db.query(query, params);

            if (result.rows.length) {
                res.status(200).json({user: result.rows[0]});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json({error: 'Error updating user'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


router.put('/update2/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {firstname, email, phone_number, role} = req.body;
        console.log(firstname, email, phone_number, role);

        try {
            const query = `
                UPDATE users 
                SET firstname = $1, 
                    email = $2, 
                    phone_number = $3, 
                    role = $4
                
                WHERE id = $5 
                RETURNING *`;
            const params = [firstname, email, phone_number, role, id];

            const result = await db.query(query, params);

            if (result.rows.length) {
                res.status(200).json({user: result.rows[0]});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (err) {
            console.error('Error updating user:', err);
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
    const {itemId, quantity} = req.body;
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
});
router.put('/update/:cartItemId', async (req, res) => {
    const {cartItemId} = req.params;
    let {quantity} = req.body;

    // Ensure quantity is a valid number and at least 1
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({error: 'Quantity must be a valid number and at least 1'});
    }

    try {
        const query = 'UPDATE cart SET quantity = $1 WHERE cart_id = $2 RETURNING *';
        const params = [quantity, cartItemId];
        const result = await db.query(query, params);

        if (result.rowCount > 0) {
            res.status(200).json({message: 'Cart item updated', cartItem: result.rows[0]});
        } else {
            res.status(404).json({error: 'Cart item not found'});
        }
    } catch (err) {
        // Log the error more descriptively
        console.error('Error updating cart item:', err);
        res.status(500).json({error: 'Error updating cart item'});
    }
});
// DELETE a cart item by cart_id
router.delete('/remove/:cart_id', async (req, res) => {
    const {cart_id} = req.params;

    if (!req.isAuthenticated()) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    try {
        // Delete the cart item by cart_id
        const result = await db.query('DELETE FROM cart WHERE cart_id = $1', [cart_id]);

        if (result.rowCount > 0) {
            res.status(200).json({message: 'Cart item removed'});
        } else {
            res.status(404).json({error: 'Cart item not found'});
        }
    } catch (error) {
        console.error('Error removing cart item:', error.message);
        res.status(500).json({error: 'Error removing cart item'});
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
            return res.status(401).json({message: "Unauthorized"});
        }

        // Extract shipping details and cart items from the request body
        const {shippingDetails, cartItems} = req.body;
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
            res.status(500).json({message: "Server error"});
        }
    } else {
        // User not authenticated
        res.status(401).json({error: 'Unauthorized'});
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


//shamika
// GET all inquiries
router.get('/inquiries/view', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const uid = req.user.id;
            const result = await db.query('SELECT * FROM inquiries WHERE uid = $1', [uid]);
            res.json({inquiries: result.rows});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error reading inquiries'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

router.get('/inquiries/viewall', async (req, res) => {
    if (req.isAuthenticated()) {
        try {

            const result = await db.query('SELECT * FROM inquiries');
            res.json({inquiries: result.rows});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error reading inquiries'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});
// POST a new inquiry
router.post('/inquiries', async (req, res) => {
    if (req.isAuthenticated()) {
        const {category, message} = req.body;
        try {
            const query = 'INSERT INTO inquiries (uid, category, message) VALUES ($1, $2, $3) RETURNING *';
            const params = [req.user.id, category, message];
            const result = await db.query(query, params);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Error creating inquiry:', err.message);
            res.status(500).json({error: 'Error creating inquiry'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// DELETE an inquiry by ID
router.delete('/inquiries/delete/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        try {
            await db.query('DELETE FROM inquiries WHERE uid = $1', [id]);
            res.status(200).json({message: 'Inquiry deleted'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error deleting inquiry'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// GET a single inquiry by ID
router.get('/inquiries/fetch/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        try {
            const result = await db.query('SELECT * FROM inquiries WHERE uid = $1', [id]);
            const inquiry = result.rows[0];
            if (inquiry) {
                res.json({inquiry});
            } else {
                res.status(404).json({error: 'Inquiry not found'});
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error fetching inquiry'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// UPDATE an inquiry by ID
router.put('/inquiries/update/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {category, message} = req.body;
        try {
            await db.query('UPDATE inquiries SET category = $1, message = $2 WHERE id = $3', [category, message, id]);
            res.status(200).json({message: 'Inquiry updated'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error updating inquiry'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// POST to respond to an inquiry by ID
router.post('/inquiries/:id/respond', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {message} = req.body;

        try {
            // Check if the inquiry exists
            const inquiryResult = await db.query('SELECT * FROM inquiries WHERE id = $1', [id]);
            const inquiry = inquiryResult.rows[0];

            if (!inquiry) {
                return res.status(404).json({error: 'Inquiry not found'});
            }

            // Update the inquiry with the response message and set responded to true
            await db.query(
                'UPDATE inquiries SET responded = true, response_message = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [message, id]
            );

            res.status(200).json({message: 'Response sent successfully'});
        } catch (err) {
            console.error('Error responding to inquiry:', err.message);
            res.status(500).json({error: 'Error responding to inquiry'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

router.get('/orders', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await db.query('SELECT * FROM orders');  // Adjust the query to your DB schema
            res.json(result.rows);  // Return the rows directly as an array
        } catch (err) {
            console.error('Error reading orders:', err.message);
            res.status(500).json({error: 'Error reading orders'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


router.get('/myappointment/fetch', async (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.user.id; // Directly assign the user ID
        try {
            // Define the userAppointments function within the route handler
            const userAppointments = async (userId) => {
                const result = await db.query(
                    `SELECT a.id                                AS appointment_id,
                            a.status,
                            a.appointment_date,
                            a.total_time,
                            a.total_cost,
                            ARRAY_AGG(DISTINCT s.name)          AS service_names,
                            p.name                              AS professional_name,
                            ARRAY_AGG(DISTINCT ats.time_number) AS time_slots
                     FROM appointments a
                              JOIN appointment_services aps ON a.id = aps.appointment_id
                              JOIN services s ON aps.service_id = s.id
                              JOIN appointment_time_slots ats ON a.id = ats.appointment_id
                              JOIN professionals p ON a.professional_id = p.id
                     WHERE a.user_id = $1
                     GROUP BY a.id, p.name
                     ORDER BY a.appointment_date DESC`, // Optional: to order by most recent appointment
                    [userId]
                );

                return result.rows; // Return all appointments for the user
            };

            const appointments = await userAppointments(userId); // Call the function to get user appointments

            if (appointments.length > 0) {
                res.json({appointments});
            } else {
                res.status(404).json({error: 'No appointments found for this user'});
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error fetching appointments'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


export default router;
