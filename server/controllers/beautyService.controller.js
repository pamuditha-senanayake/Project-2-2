import express from "express";
import service from "../services/beautyService.service.js";


const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const services = await service.getAllServices();
        res.send(services);
    } catch (error) {
        next(error)
    }
});

export default router;