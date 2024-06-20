// src/app.mjs

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Adjust path resolution for views

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to render the chatbot interface
app.get('/', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = 'Write about Sri Lanka in 30 words';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.render('index.ejs', { initialMessage: text });
    } catch (error) {
        console.error('Error generating initial content:', error);
        res.status(500).send('Error generating initial content');
    }
});

// Route to handle user queries
app.post('/ask', async (req, res) => {
    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ response: 'Sorry, there was an error. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
