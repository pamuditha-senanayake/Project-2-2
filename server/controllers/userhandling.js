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
// UPDATE the quantity of a cart item by cart_id
router.put('/update/:cartItemId', async (req, res) => {
    if (req.isAuthenticated()) {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
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
            console.error('Error updating cart item:', err.message);
            res.status(500).json({ error: 'Error updating cart item' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
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





export default router;
