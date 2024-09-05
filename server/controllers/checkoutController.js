import express from 'express';
import checkoutService from '../services/checkoutService.js'; // Adjust import path

const router = express.Router();

router.post('/', async (req, res) => {
    const { shippingDetails, cartItems } = req.body;
    const userId = 1; // Replace with authentication logic

    try {
        const result = await checkoutService.checkout(userId, shippingDetails, cartItems);
        res.json(result);
    } catch (err) {
        console.error('Error during checkout:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
