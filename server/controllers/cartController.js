import express from 'express';
import cartService from '../services/cartService.js'; // Adjust import according to your project structure

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

router.put('/update', async (req, res) => {
    const {  itemId, quantity } = req.body;

    if (!userId || !itemId || quantity == null) {
        return res.status(400).json({ error: 'userId, itemId, and quantity are required.' });
    }

    try {
        const updatedItem = await cartService.updateItemQuantity(itemId, quantity);

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found in cart.' });
        }

        return res.json(updatedItem);
    } catch (err) {
        console.error('Error updating item quantity:', err.message);
        return res.status(500).json({ error: 'Server error.' });
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
