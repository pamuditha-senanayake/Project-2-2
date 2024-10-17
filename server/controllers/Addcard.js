import express from 'express';
import db from '../db.js';

const router = express.Router();

// Add card details
router.post('/api/cards', async (req, res) => {
    const { card_holder_name, card_number, expiration_date, cvv } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO card_details (card_holder_name, card_number, expiration_date, cvv) VALUES ($1, $2, $3, $4) RETURNING *',
            [card_holder_name, card_number, expiration_date, cvv]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add card details' });
    }
});

// Get all card details
router.get('/api/cards', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM card_details');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve card details' });
    }
});

// Update card details
router.put('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    const { card_holder_name, card_number, expiration_date, cvv } = req.body;
    try {
        const result = await db.query(
            'UPDATE card_details SET card_holder_name = $1, card_number = $2, expiration_date = $3, cvv = $4 WHERE id = $5 RETURNING *',
            [card_holder_name, card_number, expiration_date, cvv, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update card details' });
    }
});

// Delete card details
router.delete('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM card_details WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete card details' });
    }
});

export default router;
