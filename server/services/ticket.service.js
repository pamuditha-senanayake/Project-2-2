import db from "../db.js";

const addTicket = async (ticketData) => {
    const {
        ticket_no,
        user_id,
        email,
        contact_no,
        category,
        inquiry_description,
        status,
        catalog,
        notifications,
        remarks
    } = ticketData;

    const result = await db.query(
        `INSERT INTO support_ticket (ticket_no, user_id, email, contact_no, category, inquiry_description, status, catalog, notifications, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [ticket_no, user_id, email, contact_no, category, inquiry_description, status, catalog, notifications, remarks]
    );

    return result.rows[0].id; // Return the ticket ID
};


const getTicketById = async (ticketId) => {
    const result = await db.query(
        `SELECT * FROM support_ticket WHERE id = $1`,
        [ticketId]
    );

    if (result.rows.length === 0) {
        throw new Error('Ticket not found');
    }

    return result.rows[0]; // Return the ticket data
};
const updateTicket = async (ticketId, updatedData) => {
    const {
        ticket_no,
        user_id,
        email,
        contact_no,
        category,
        inquiry_description,
        status,
        catalog,
        notification,
        remarks
    } = updatedData;

    const result = await db.query(
        `UPDATE support_ticket SET
            ticket_no = $1,
            user_id = $2,
            email = $3,
            contact_no = $4,
            category = $5,
            inquiry_description = $6,
            status = $7,
            catalog = $8,
            notification = $9,
            remarks = $10
         WHERE id = $11 RETURNING id`,
        [ticket_no, user_id, email, contact_no, category, inquiry_description, status, catalog, notifications, remarks, ticketId]
    );

    if (result.rows.length === 0) {
        throw new Error('Ticket not found or no changes made');
    }

    return result.rows[0].id; // Return the updated ticket ID
};


const deleteTicket = async (ticketId) => {
    const result = await db.query(
        `DELETE FROM support_ticket WHERE id = $1 RETURNING id`,
        [ticketId]
    );

    if (result.rows.length === 0) {
        throw new Error('Ticket not found or already deleted');
    }

    return result.rows[0].id; // Return the deleted ticket ID
};


// GET route to fetch categories
router.get('/categories', async (req, res, next) => {
    try {
        const result = await db.query('SELECT id, name FROM categories'); // Adjust your query as needed
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
});
export default {
    addTicket,
    getTicketById,
    updateTicket,
    deleteTicket
};