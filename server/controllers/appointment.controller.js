import service from "../services/appointment.service.js";
import appointment from "../services/appointment.service.js";
import express from "express";

const router = express.Router();

router.post('/confirm', async (req, res, next) => {
    try {
        const {appointmentData, serviceIds, time_numbers} = req.body;

        // Ensure the required data is present
        if (!appointmentData || !Array.isArray(serviceIds) || !Array.isArray(time_numbers)) {
            return res.status(400).json({message: 'Invalid input data'});
        }

        // Create the appointment
        const appointmentId = await service.addAppointment(appointmentData);

        // Add services and time slots to the appointment
        await service.addAppointmentServices(appointmentId, serviceIds);
        await service.addAppointmentTimeSlots(appointmentId, time_numbers);

        res.status(201).json({appointmentId});
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/:appointmentId', async (req, res, next) => {
    const {appointmentId} = req.params;

    // Ensure the appointmentId is provided
    if (!appointmentId) {
        return res.status(400).json({message: 'Appointment ID is required'});
    }

    try {
        // Delete related services and time slots first
        await service.deleteAppointmentServices(appointmentId);
        await service.deleteAppointmentTimeSlots(appointmentId);

        // Then delete the appointment
        await service.deleteAppointment(appointmentId);

        res.status(200).json({message: 'Appointment deleted successfully'});
    } catch (error) {
        next(error);
    }
});

router.get('/unavailable/:professional_id/:appointment_date', async (req, res, next) => {
    const {professional_id, appointment_date} = req.params;
    console.log(professional_id, appointment_date)

    //Ensure the appointmentId is provided
    // if (!appointmentId) {
    //     return res.status(400).json({message: 'Appointment ID is required'});
    // }
    try {
        const unavailableSlots = await service.getAppointmentTimeSlots(professional_id, appointment_date);
        res.status(200).json(unavailableSlots);
    } catch (error) {
        next(error);
    }
});

router.get('/all', async (req, res, next) => {
    try {
        const appointments = await appointment.getAllAppointmentDetails();
        res.send(appointments);

    } catch (error) {
        next(error)
    }
});

router.get('/status/:appointmentId', async (req, res, next) => {
    const {appointmentId} = req.params;
    try {
        const status = await appointment.getAppointmentStatus(appointmentId);
        res.send(status);

    } catch (error) {
        next(error)
    }
});

router.put('/confirmed/:appointmentId', async (req, res, next) => {
    const {appointmentId} = req.params;
    try {
        const status = await appointment.updateConfirmedAppointment(appointmentId);
        res.send(status);

    } catch (error) {
        next(error)
    }
});

router.put('/rejected/:appointmentId', async (req, res, next) => {
    const {appointmentId} = req.params;
    try {
        const status = await appointment.updateRejectedAppointment(appointmentId);
        res.send(status);

    } catch (error) {
        next(error)
    }
});


export default router

