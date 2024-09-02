import express from 'express';
import db from '../db.js'; // Import db from db.js
import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import env from 'dotenv';

env.config();

const router = express.Router();
const saltRounds = 10;

router.get('/crud', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await db.query('SELECT * FROM hours WHERE uid = $1', [req.user.id]);
            const hours = result.rows;
            res.render('crud.ejs', { hours: hours.length > 0 ? hours : [] });
        } catch (err) {
            console.log(err);
            res.render('crud.ejs', { hours: 'reading error' });
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/deletecrud/:id', async (req, res) => {
    const { id } = req.params;
    if (req.isAuthenticated()) {
        try {
            await db.query('DELETE FROM hours WHERE id = $1', [id]);
            res.redirect('/crud');
        } catch (err) {
            console.log(err);
            res.send('Error deleting record.');
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/updatecrud/:id', async (req, res) => {
    const { id } = req.params;
    if (req.isAuthenticated()) {
        try {
            const result = await db.query('SELECT * FROM hours WHERE id = $1', [id]);
            const hour = result.rows[0];
            if (hour) {
                res.render('update.ejs', { hour: hour });
            } else {
                res.send('Record not found.');
            }
        } catch (err) {
            console.log(err);
            res.send('Error fetching record.');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/updatecrud/:id', async (req, res) => {
    const { id } = req.params;
    const { hours, place } = req.body;
    if (req.isAuthenticated()) {
        try {
            await db.query('UPDATE hours SET hours = $1, place = $2 WHERE id = $3', [hours, place, id]);
            res.redirect('/crud');
        } catch (err) {
            console.log(err);
            res.send('Error updating record.');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/crudsubmit', async (req, res) => {
    const { hours, place } = req.body;
    if (req.isAuthenticated()) {
        try {
            await db.query('INSERT INTO hours (uid, hours, place) VALUES ($1, $2, $3)', [req.user.id, hours, place]);
            res.redirect('/crud');
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/login');
    }
});

export default router;
