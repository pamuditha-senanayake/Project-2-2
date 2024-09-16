// ticketController.js
const Ticket = require('../models/ticketModel');

// Controller to create a new ticket
const createTicket = async (req, res) => {
    try {
        const { customer_id, email, contact_no, category, inquiry_description } = req.body;

        // Automatically generate ticket number
        const ticket_no = `TICKET-${Math.floor(Math.random() * 100000)}`;

        // Create a new ticket in the database
        const newTicket = new Ticket({
            ticket_no,
            customer_id,
            email,
            contact_no,
            category,
            inquiry_description,
            status: 'open',  // Default status for a new ticket
            date_submitted: new Date()
        });

        // Save the ticket
        await newTicket.save();

        // Send the created ticket as a response
        res.status(201).json(newTicket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};

module.exports = {
    createTicket
};
