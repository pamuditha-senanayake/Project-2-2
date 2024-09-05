import express from 'express';
import cartService from '../services/cartService.js'; // Adjust import according to your project structure

const router = express.Router();

// Add or update item in the cart
router.put('/add', async (req, res) => {
    const { userId, itemId, quantity } = req.body;
    try {
        const updatedItem = await cartService.addOrUpdateItem(userId, itemId, quantity);
        res.json(updatedItem);
    } catch (err) {
        console.error('Error adding/updating item in cart:', err.message);
        res.status(500).send('Server Error');
    }
});

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
// Update the quantity of a specific item in the cart
router.put('/update', async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        const updatedItem = await cartService.updateItemQuantity(itemId, quantity);
        res.json(updatedItem);
    } catch (err) {
        console.error('Error updating item quantity:', err.message);
        res.status(500).send('Server Error');
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
