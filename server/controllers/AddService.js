// back end


import express from 'express';
import db from '../db.js';

const router = express.Router();


//Add category

router.post("/categories", async (req, res) => {
    try {
        const {name} = req.body;
        const newCategory = await db.query(
            "INSERT INTO categories (name) VALUES($1) RETURNING *",
            [name]
        );

        res.json(newCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "This category is always available"});
    }
});


//display category

router.get("/categories", async (req, res) => {
    try {
        const allCategories = await db.query("SELECT * FROM categories");
        res.json(allCategories.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});

//Delete category

router.delete("/categories/:id", async (req, res) => {
    try {
        const {id} = req.params;

//Update service to null
        await db.query(
            "UPDATE services SET category_id = NULL WHERE category_id = $1",
            [id]
        );

        const deleteCategory = await db.query(
            "DELETE FROM categories WHERE id = $1 RETURNING *",
            [id]
        );


        res.json({message: "Category deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});


//Add service

router.post("/services", async (req, res) => {
    try {
        const {name, description, price, duration, category_id} = req.body;
        const newService = await db.query(
            "INSERT INTO services (name, description, price, duration, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, duration, category_id]
        );

        res.json(newService.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});


//Display service

router.get("/services", async (req, res) => {
    try {
        const allServices = await db.query("SELECT * FROM services");
        res.json(allServices.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});


//Edit service

router.put("/services/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, price, duration, category_id} = req.body;

        const updatedService = await db.query(
            `UPDATE services
           SET name = $1, description = $2, price = $3, duration = $4, category_id = $5
           WHERE id = $6 RETURNING *`,
            [name, description, price, duration, category_id, id]
        );

        res.json(updatedService.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});

// router.put("/services/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, description, price, duration, category_id } = req.body;
//
//         // Convert the duration from minutes to PostgreSQL INTERVAL
//         const durationInMinutes = duration.minutes || 0; // Default to 0 if not provided
//         const durationInterval = `${durationInMinutes} minutes`; // Create the interval string
//
//         const updatedService = await db.query(
//             `UPDATE services
//              SET name = $1, description = $2, price = $3, duration = $4, category_id = $5
//              WHERE id = $6 RETURNING *`,
//             [name, description, price, durationInterval, category_id, id]
//         );
//
//         res.json(updatedService.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });



//Delete service

router.delete("/services/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteService = await db.query(
            "DELETE FROM services WHERE id = $1 RETURNING *",
            [id]
        );

        res.json({message: "Service deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: "Internal server error"});
    }
});



export default router;
