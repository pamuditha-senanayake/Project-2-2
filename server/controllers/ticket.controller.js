// import service from "../services/ticket.service.js";
// import express from "express";
//
// const router = express.Router();
//
//
// router.post('/submit', async (req, res, next) => {
//     try {
//         const ticketData = req.body;
//
//         // Ensure the required data is present
//         const { ticket_no, user_id, email, contact_no, category, inquiry_description } = ticketData;
//         if (!ticket_no || !user_id || !email || !contact_no || !category || !inquiry_description) {
//             return res.status(400).json({ message: 'Invalid input data' });
//         }
//
//         // Add the ticket to the database
//         const ticketId = await service.addTicket(ticketData);
//
//         res.status(201).json({ ticketId });
//     } catch (error) {
//         next(error);
//     }
// });
//
//
// // GET route to retrieve a ticket by ID
// router.get('/ticket/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const result = await db.query('SELECT * FROM support_ticket WHERE id = $1', [id]);
//
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'Ticket not found' });
//         }
//
//         res.status(200).json(result.rows[0]);
//     } catch (error) {
//         next(error);
//     }
// });
//
// // PUT route to update a ticket by ID
// router.put('/ticket/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const ticketData = req.body;
//
//         // Ensure the required data is present for update
//         const { email, contact_no, category, inquiry_description, status, catalog, notifications, remarks } = ticketData;
//         if (!email || !contact_no || !category || !inquiry_description) {
//             return res.status(400).json({ message: 'Invalid input data' });
//         }
//
//         await db.query(
//             `UPDATE support_ticket SET
//              email = $1,
//              contact_no = $2,
//              category = $3,
//              inquiry_description = $4,
//              status = $5,
//              catalog = $6,
//              notifications = $7,
//              remarks = $8
//              WHERE id = $9`,
//             [email, contact_no, category, inquiry_description, status, catalog, notifications, remarks, id]
//         );
//
//         res.status(200).json({ message: 'Ticket updated successfully' });
//     } catch (error) {
//         next(error);
//     }
// });
//
// // DELETE route to remove a ticket by ID
// router.delete('/ticket/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         await db.query('DELETE FROM support_ticket WHERE id = $1', [id]);
//         res.status(204).send(); // No content to send back
//     } catch (error) {
//         next(error);
//     }
// });
// export default router