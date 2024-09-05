import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all records
router.get('/view', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const uid = req.user.id;
            const result = await db.query('SELECT * FROM hours WHERE uid = $1', [uid]);
            res.json({hours: result.rows});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error reading records'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


/// DELETE a record by ID
router.delete('/delete/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        try {
            await db.query('DELETE FROM hours WHERE id = $1', [id]);
            res.status(200).json({message: 'Record deleted'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error deleting record'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// GET a record by ID
router.get('/fetch/:id', async (req, res) => {
    if (req.isAuthenticated()) {
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
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// UPDATE a record by ID
router.put('/update/:id', async (req, res) => {
    if (req.isAuthenticated()) {
        const {id} = req.params;
        const {hours, place} = req.body;
        try {
            await db.query('UPDATE hours SET hours = $1, place = $2 WHERE id = $3', [hours, place, id]);
            res.status(200).json({message: 'Record updated'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Error updating record'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});

// POST a new record
router.post('/', async (req, res) => {
    if (req.isAuthenticated()) {
        const {hours, place} = req.body;
        try {
            const query = 'INSERT INTO hours (uid, hours, place) VALUES ($1, $2, $3)';
            const params = [req.user.id, hours, place];
            const result = await db.query(query, params);
            res.status(201).json({message: 'Record created'});
        } catch (err) {
            console.error('Error creating record:', err.message);
            res.status(500).json({error: 'Error creating record'});
        }
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});


export default router;
