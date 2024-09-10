import express from "express";
import service from "../services/professional.service.js";


const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const professional = await service.getAllProfessional();
        res.send(professional);
    } catch (error) {
        next(error)
    }
});

export default router;