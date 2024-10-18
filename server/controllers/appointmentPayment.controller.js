import db from '../db.js';
import multer from "multer";
import express from "express";


const router = express.Router();

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({storage});

router.post('/upload-slip/:appointmentId', upload.single('slip'), async (req, res) => {
    const {appointmentId} = req.params; // Get the appointmentId from the URL
    const paymentSlip = req.file; // Access the uploaded file

    if (!paymentSlip) {
        return res.status(400).json({message: 'No file uploaded.'});
    }

    try {
        // Convert the uploaded file's buffer to bytea format for PostgreSQL
        const paymentSlipBuffer = paymentSlip.buffer;

        // Update the corresponding appointment in the database
        const query = `
            UPDATE public.appointments
            SET payment_slip = $1
            WHERE id = $2
        `;
        await db.query(query, [paymentSlipBuffer, appointmentId]);

        // Send a success response back to the client
        res.status(200).json({message: 'Slip uploaded successfully!'});
    } catch (error) {
        console.error('Error uploading slip:', error);
        res.status(500).json({message: 'An error occurred while uploading the payment slip.'});
    }
});

export default router;