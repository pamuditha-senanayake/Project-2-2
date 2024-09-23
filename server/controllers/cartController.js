import express from 'express';
import cartService from '../services/cartService.js'; // Adjust import according to your project structure
import db from '../db.js';
const router = express.Router();

// Add or update item in the cart
// router.put('/add', async (req, res) => {
//     const { userId, itemId, quantity } = req.body;
//     try {
//         const updatedItem = await cartService.addOrUpdateItem(userId, itemId, quantity);
//         res.json(updatedItem);
//     } catch (err) {
//         console.error('Error adding/updating item in cart:', err.message);
//         res.status(500).send('Server Error');
//     }
// });
// router.put("/add", async (req, res) => {
//     //res.setHeader('Cache-Control', 'no-store'); // Disable caching
//     if (!req.isAuthenticated()) {
//         return res.status(401).json({message: "Unauthorized"});
//     }
//     const {  itemId, quantity } = req.body;
//     try {
//         const updatedItem = await cartService.addOrUpdateItem(req.user.id, itemId, quantity);
//         res.json(updatedItem);
//         console.log(req.user.id);
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         res.status(500).json({message: "Server error"});
//     }
// });

// Get cart items for a specific user
router.get('/', async (req, res) => {
    const { userId } = req.query; // Assuming userId is passed as a query parameter
    try {
        const cartItems = await cartService.getCartItems(userId);
        res.json(cartItems);
    } catch (err) {
        console.error('Error fetching cart:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.put('/update', async (req, res) => {
//     const {  itemId, quantity } = req.body;
//
//     if ( !itemId || quantity == null) {
//         return res.status(400).json({ error: ' itemId, and quantity are required.' });
//     }
//
//     try {
//         const updatedItem = await cartService.updateItemQuantity(itemId, quantity);
//
//         if (!updatedItem) {
//             return res.status(404).json({ error: 'Item not found in cart.' });
//         }
//
//         return res.json(updatedItem);
//     } catch (err) {
//         console.error('Error updating item quantity:', err.message);
//         return res.status(500).json({ error: 'Server error.' });
//     }
// });

router.put('/update/:cartItemId', async (req, res) => {
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

// Delete an item from the cart
router.delete('/:userId/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        await cartService.removeItem(itemId);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error('Error removing item from cart:', err.message);
        res.status(500).send('Server Error');
    }
});



export default router;
