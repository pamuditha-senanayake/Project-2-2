import service from "../services/confirm.service.js";
import express from "express";

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const {appointmentData, serviceIds, timeSlotIds} = req.body;

        // Ensure the required data is present
        if (!appointmentData || !Array.isArray(serviceIds) || !Array.isArray(timeSlotIds)) {
            return res.status(400).json({message: 'Invalid input data'});
        }

        // Create the appointment
        const appointmentId = await service.addAppointment(appointmentData);

        // Add services and time slots to the appointment
        await service.addAppointmentServices(appointmentId, serviceIds);
        await service.addAppointmentTimeSlots(appointmentId, timeSlotIds);

        res.status(201).json({appointmentId});
    } catch (error) {
        next(error);
    }
});

export default router

