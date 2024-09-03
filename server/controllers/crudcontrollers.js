import express from 'express';
import db from '../db.js';

const router = express.Router();

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
    console.log('Authentication check for request:', req.method, req.url);
    console.log('User:', req.user);


    if (req.isAuthenticated()) {
        console.log('User is authenticated');
        return next();
    } else {
        // console.log('User is not authenticated');
        return res.status(401).json({error: 'Unauthorized'});
    }
};


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


// DELETE a record by ID
router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
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
    // console.log('Received request to create record with data:', {hours, place});
    // console.log('Authenticated user ID:', req.user.id);

    try {
        // Log the SQL query and parameters
        const query = 'INSERT INTO hours (uid, hours, place) VALUES ($1, $2, $3)';
        const params = [req.user.id, hours, place];
        // console.log('Executing SQL query:', query, 'with parameters:', params);

        const result = await db.query(query, params);

        // Log the result of the query
        // console.log('Record creation result:', result);

        res.status(201).json({message: 'Record created'});
    } catch (err) {
        console.error('Error creating record:', err.message);
        console.error('Stack trace:', err.stack);
        res.status(500).json({error: 'Error creating record'});
    }
});


export default router;
