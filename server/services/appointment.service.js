import db from "../db.js";

const addAppointment = async (appointmentData) => {
    const {user_id, professional_id, appointment_date, total_time, total_cost} = appointmentData;
    const result = await db.query(
        `INSERT INTO appointments (user_id, professional_id, appointment_date, total_time, total_cost)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [user_id, professional_id, appointment_date, total_time, total_cost]
    );

    return result.rows[0].id; // Return the appointment ID
};

const addAppointmentServices = async (appointmentId, serviceIds) => {
    try {
        for (const serviceId of serviceIds) {
            await db.query(
                `INSERT INTO appointment_services (appointment_id, service_id)
                 VALUES ($1, $2)`,
                [appointmentId, serviceId]
            );
        }
    } catch (error) {
        throw error;
    }
};

const addAppointmentTimeSlots = async (appointmentId, time_numbers) => {
    try {
        for (const time_number of time_numbers) {
            await db.query(
                `INSERT INTO appointment_time_slots (appointment_id, time_number)
                 VALUES ($1, $2)`,
                [appointmentId, time_number]
            );
        }
    } catch (error) {
        throw error;
    }
};

const deleteAppointment = async (appointmentId) => {
    try {
        await db.query(
            `DELETE FROM appointments WHERE id = $1`,
            [appointmentId]
        );
    } catch (error) {
        throw error;
    }
};

const deleteAppointmentServices = async (appointmentId) => {
    try {
        await db.query(
            `DELETE FROM appointment_services WHERE appointment_id = $1`,
            [appointmentId]
        );
    } catch (error) {
        throw error;
    }
};

const deleteAppointmentTimeSlots = async (appointmentId) => {
    try {
        await db.query(
            `DELETE FROM appointment_time_slots WHERE appointment_id = $1`,
            [appointmentId]
        );
    } catch (error) {
        throw error;
    }
};

const getAppointmentTimeSlots = async (professional_id, appointment_date) => {
    try {
        const result = await db.query(
            `SELECT time_number FROM appointment_time_slots ats
             JOIN appointments a ON ats.appointment_id = a.id
             WHERE a.professional_id = $1 AND a.appointment_date = $2`,
            [professional_id, appointment_date]
        );

        return result.rows.map(row => row.time_number); // Return an array of time_numbers
    } catch (error) {
        throw error;
    }
};


export default {
    addAppointment,
    addAppointmentServices,
    addAppointmentTimeSlots,
    deleteAppointment,
    deleteAppointmentServices,
    deleteAppointmentTimeSlots,
    getAppointmentTimeSlots
};
