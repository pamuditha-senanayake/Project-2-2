import db from "../db.js";

const addAppointment = async (appointmentData) => {
    const {user_id, professional_id, appointment_date, total_time, total_cost} = appointmentData;
    const result = await db.query(
        `INSERT INTO appointments (user_id, professional_id, appointment_date, total_time, total_cost, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [user_id, professional_id, appointment_date, total_time, total_cost, 'pending']
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

const getAllAppointmentDetails = async () => {
    try {
        const result = await db.query(
            `SELECT 
                a.user_id, 
                u.name AS user_name, 
                a.id AS appointment_id, 
                a.appointment_date,      -- Include appointment_date in the SELECT clause
                p.name AS professional_name, 
                ARRAY_AGG(DISTINCT s.name) AS service_names, 
                ARRAY_AGG(DISTINCT ats.time_number) AS time_numbers, 
                a.total_time, 
                a.total_cost 
             FROM appointments a
             JOIN appointment_services aps ON a.id = aps.appointment_id
             JOIN services s ON aps.service_id = s.id
             JOIN appointment_time_slots ats ON a.id = ats.appointment_id
             JOIN professionals p ON a.professional_id = p.id
             JOIN users u ON a.user_id = u.id
             GROUP BY a.id, p.name, u.name, a.appointment_date`  // Add appointment_date to the GROUP BY clause
        );

        return result.rows; // Return an array of objects containing all required fields, including appointment_date
    } catch (error) {
        throw error;
    }
};

const getAppointmentStatus = async (appointmentId) => {
    const result = await db.query(
        `SELECT 
            a.status, 
            a.appointment_date,
            a.total_time, 
            a.total_cost, 
            ARRAY_AGG(DISTINCT s.name) AS service_names, 
            p.name AS professional_name, 
            ARRAY_AGG(DISTINCT ats.time_number) AS time_slots
         FROM appointments a
         JOIN appointment_services aps ON a.id = aps.appointment_id
         JOIN services s ON aps.service_id = s.id
         JOIN appointment_time_slots ats ON a.id = ats.appointment_id
         JOIN professionals p ON a.professional_id = p.id
         WHERE a.id = $1
         GROUP BY a.id, p.name`,
        [appointmentId]
    );

    return result.rows[0]; // Return the status of the appointment

};

const updateConfirmedAppointment = async (appointmentId) => {
    try {
        await db.query(
            `UPDATE appointments
             SET status = 'confirmed'
             WHERE id = $1`,
            [appointmentId]
        );
    } catch (error) {
        throw error;
    }
};

const updateRejectedAppointment = async (appointmentId) => {
    try {
        await db.query(
            `UPDATE appointments
             SET status = 'rejected'
             WHERE id = $1`,
            [appointmentId]
        );
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
    getAppointmentTimeSlots,
    getAllAppointmentDetails,
    getAppointmentStatus,
    updateConfirmedAppointment,
    updateRejectedAppointment
};
