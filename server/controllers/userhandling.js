import express from 'express';
import db from '../db.js';
import cartService from "../services/cartService.js"; // Replace with your actual DB connection module

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
});


// PUT - Update item quantity in cart
// router.put('/update', async (req, res) => {
//     if (req.isAuthenticated()) {
//         const { user_id, itemId, quantity } = req.body;
//
//         if (quantity < 1) {
//             return res.status(400).json({ message: 'Quantity must be at least 1.' });
//         }
//
//         try {
//             const result = await db.query(
//                 'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
//                 [quantity, user_id, itemId]
//             );
//
//             if (result.rowCount > 0) {
//                 res.status(200).json({ message: 'Cart item updated', cartItem: result.rows[0] });
//             } else {
//                 res.status(404).json({ message: 'Item not found in cart.' });
//             }
//         } catch (err) {
//             console.error('Error updating cart item:', err.message);
//             res.status(500).json({ message: 'Server error' });
//         }
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// });

// Delete an item from the cart
router.delete('/:userId/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;
    try {
        await cartService.removeItem(userId, itemId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE an item from the cart by item ID (only for the logged-in user)
// router.delete('/cart/delete/:itemId', async (req, res) => {
//     if (req.isAuthenticated()) {
//         const userId = req.user.id;  // Assuming user ID is available from session or token
//         const { itemId } = req.params;
//
//         try {
//             // Check if the item exists for the logged-in user in their cart
//             const result = await db.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, itemId]);
//
//             if (result.rowCount > 0) {
//                 res.status(200).json({ message: 'Item removed from cart' });
//             } else {
//                 res.status(404).json({ error: 'Item not found in your cart' });
//             }
//         } catch (err) {
//             console.error('Error removing item from cart:', err.message);
//             res.status(500).json({ error: 'Error removing item from cart' });
//         }
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// });






export default router;
