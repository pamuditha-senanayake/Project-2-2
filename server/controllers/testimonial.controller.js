import express from "express";
import service from "../services/testimonial.service.js";

const router = express.Router();

// List of hateful words/phrases to filter out
const hatefulWords = [
    "hate", "stupid", "idiot", "dumb", "unacceptable", // Add more as needed
];

// Function to check if text contains hateful words
const containsHatefulWords = (text) => {
    return hatefulWords.some(word => text.toLowerCase().includes(word));
};

// Get all testimonials
router.get("/", async (req, res, next) => {
        try {
                const testimonials = await service.getAllTestimonials();
                res.send(testimonials);
        } catch (error) {
                next(error);
        }
});

router.get("/approved", async (req, res, next) => {
        try {
                const testimonials = await service.getApprovedTestimonials();
                res.send(testimonials);
        } catch (error) {
                next(error);
        }
});

// Get a testimonial by ID
router.get("/:id", async (req, res, next) => {
        try {
                const testimonial = await service.getTestimonialById(
                        req.params.id
                );
                if (testimonial === undefined) {
                        res.status(404).json(
                                "No record with given id: " + req.params.id
                        );
                } else {
                        res.send(testimonial);
                }
        } catch (error) {
                next(error);
        }
});

// Delete a testimonial by ID
router.delete("/:id", async (req, res, next) => {
        try {
                const deletedTestimonial = await service.deleteTestimonial(
                        req.params.id
                );
                if (!deletedTestimonial) {
                        res.status(404).json(
                                "No record with given id: " + req.params.id
                        );
                } else {
                        res.send("Deleted successfully.");
                }
        } catch (error) {
                next(error);
        }
});

// Add a new testimonial
router.post("/", async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Validate if the testimonial contains hateful words
        if (containsHatefulWords(title) || containsHatefulWords(description)) {
            return res.status(400).json({ error: "Testimonial contains inappropriate content." });
        }

        // Proceed to add the testimonial if no hateful words are found
        const newTestimonial = await service.addTestimonial(req.body);
        res.status(201).json(newTestimonial);
    } catch (error) {
        next(error);
    }
});

// Update a testimonial by ID
router.put("/:id", async (req, res, next) => {
        try {
                const { id } = req.params;
                const { rating, title, description } = req.body;
                const updatedTestimonial = await service.updateTestimonial(id, {
                        rating,
                        title,
                        description,
                });
                if (!updatedTestimonial) {
                        return res
                                .status(404)
                                .json({ error: "Testimonial not found" });
                }
                res.status(200).json(updatedTestimonial);
        } catch (error) {
                console.error("Error updating testimonial:", error);
                res.status(500).json({ error: "Error updating testimonial" });
        }
});

// Approve a testimonial by ID
router.put("/approve/:id", async (req, res, next) => {
        try {
                const { id } = req.params;
                const { status } = req.body;
                const updatedTestimonial = await service.approveTestimonial(
                        id,
                        { status }
                );
                if (!updatedTestimonial) {
                        return res
                                .status(404)
                                .json({ error: "Testimonial not found" });
                }
                res.status(200).json(updatedTestimonial);
        } catch (error) {
                console.error("Error approving testimonial:", error);
                res.status(500).json({ error: "Error approving testimonial" });
        }
});

export default router;
