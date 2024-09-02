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
    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        for (const serviceId of serviceIds) {
            await client.query(
                `INSERT INTO appointment_services (appointment_id, service_id)
                 VALUES ($1, $2)`,
                [appointmentId, serviceId]
            );
        }

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const addAppointmentTimeSlots = async (appointmentId, timeSlotIds) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        for (const timeSlotId of timeSlotIds) {
            await client.query(
                `INSERT INTO appointment_time_slots (appointment_id, time_slot_id)
                 VALUES ($1, $2)`,
                [appointmentId, timeSlotId]
            );
        }

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw error;
    } finally {
        client.release(); // Release the client back to the pool
    }
};


export default {
    addAppointment,
    addAppointmentServices,
    addAppointmentTimeSlots
};
