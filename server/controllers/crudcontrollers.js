import express from 'express';
import db from '../db.js';

const router = express.Router();

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({error: 'Unauthorized'});
};

// GET all records
router.get('/crud', ensureAuthenticated, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM hours WHERE uid = $1', [req.user.id]);
        res.json({hours: result.rows});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error reading records'});
    }
});

// DELETE a record by ID
router.delete('/crud/:id', ensureAuthenticated, async (req, res) => {
    const {id} = req.params;
    try {
        await db.query('DELETE FROM hours WHERE id = $1', [id]);
        res.status(200).json({message: 'Record deleted'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error deleting record'});
    }
});

// GET a record by ID
router.get('/crud/:id', ensureAuthenticated, async (req, res) => {
    const {id} = req.params;
    try {
        const result = await db.query('SELECT * FROM hours WHERE id = $1', [id]);
        const hour = result.rows[0];
        if (hour) {
            res.json({hour});
        } else {
            res.status(404).json({error: 'Record not found'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error fetching record'});
    }
});

// UPDATE a record by ID
router.put('/crud/:id', ensureAuthenticated, async (req, res) => {
    const {id} = req.params;
    const {hours, place} = req.body;
    try {
        await db.query('UPDATE hours SET hours = $1, place = $2 WHERE id = $3', [hours, place, id]);
        res.status(200).json({message: 'Record updated'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error updating record'});
    }
});

// POST a new record
router.post('/', ensureAuthenticated, async (req, res) => {
    const {hours, place} = req.body;
    try {
        await db.query('INSERT INTO hours (uid, hours, place) VALUES ($1, $2, $3)', [req.user.id, hours, place]);
        res.status(201).json({message: 'Record created'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error creating record'});
    }
});

export default router;
