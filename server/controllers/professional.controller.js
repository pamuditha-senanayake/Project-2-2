import express from "express";
import service from "../services/professional.service.js";


const router = express.Router();

/*router.get('/', async (req, res, next) => {
    try {
        const professional = await service.getAllProfessional();
        res.send(professional);
    } catch (error) {
        next(error)
    }
});*/

router.get('/', async (req, res, next) => {
    try {
        // Assuming selected service IDs are passed as a query parameter like ?services=1,2,3
        const selectedServiceIds = req.query.services ? req.query.services.split(',') : [];

        const professionals = await service.getAllSProfessional(selectedServiceIds);
        res.send(professionals);
    } catch (error) {
        next(error);
    }
});


export default router;