import express from 'express';
import productsService from '../services/productsService.js'; // Adjust import path

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

export default router;
