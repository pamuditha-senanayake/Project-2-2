// ticketController.js
const db = require('../db'); // assuming you're using a database connection file
const { v4: uuidv4 } = require('uuid'); // to generate unique ticket numbers

// Function to map category to catalog
const getCatalogByCategory = (category) => {
    switch(category) {
        case 'Booking and Appointment Issues':
            return 'Catalog 1';
        case 'Payment and Billing Concerns':
            return 'Catalog 2';
        case 'Service-Related Complaints':
            return 'Catalog 3';
        case 'Product Inquiries and Issues':
            return 'Catalog 4';
        case 'Technical Problems with the Online Platform':
            return 'Catalog 5';
        default:
            return 'Uncategorized';
    }
};

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { customer_id, category, inquiry_description, remarks } = req.body;

        // Fetch customer details from the customer table
        const customer = await db.query('SELECT email, contact_no FROM customers WHERE customer_id = $1', [customer_id]);

        if (customer.rows.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const { email, contact_no } = customer.rows[0];

        // Generate new ticket number (UUID for uniqueness)
        const ticket_no = uuidv4();

        // Assign default values
        const status = 'Pending'; // Ticket status starts as 'Pending'
        const catalog = getCatalogByCategory(category); // Get catalog based on the category
        const notifications = `Ticket ${ticket_no} submitted. Status: ${status}`; // Notification on submission

        // Insert new ticket into the tickets table
        const newTicket = await db.query(
            `INSERT INTO tickets (ticket_no, customer_id, email, contact_no, category, inquiry_description, status, catalog, notifications, remarks)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [ticket_no, customer_id, email, contact_no, category, inquiry_description, status, catalog, notifications, remarks]
        );

        res.status(201).json({
            message: "Ticket created successfully",
            ticket: newTicket.rows[0]
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await db.query('SELECT * FROM tickets');
        res.status(200).json(tickets.rows);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
    const { ticket_no } = req.params;

    try {
        const ticket = await db.query('SELECT * FROM tickets WHERE ticket_no = $1', [ticket_no]);

        if (ticket.rows.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json(ticket.rows[0]);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update ticket status and notifications
exports.updateTicketStatus = async (req, res) => {
    const { ticket_no } = req.params;
    const { status, remarks } = req.body;

    try {
        // Update status and notifications
        const updatedTicket = await db.query(
            `UPDATE tickets 
             SET status = $1, 
                 notifications = CONCAT(notifications, ', Status updated to ', $1), 
                 remarks = $2 
             WHERE ticket_no = $3 RETURNING *`,
            [status, remarks, ticket_no]
        );

        if (updatedTicket.rows.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket.rows[0]
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
    const { ticket_no } = req.params;

    try {
        const deletedTicket = await db.query('DELETE FROM tickets WHERE ticket_no = $1 RETURNING *', [ticket_no]);

        if (deletedTicket.rows.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};
