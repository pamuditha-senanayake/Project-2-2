import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Hotel information
const salonDescription = [
  "Welcome to Salon Diamond, nestled in the charming city of Kandy, Sri Lanka.",
  "Our salon offers a range of luxurious beauty treatments and hair services tailored to your needs.",
  "Experience top-notch services from our skilled team of professionals dedicated to making you look and feel your best.",
  "Enjoy a relaxing atmosphere with elegant decor and premium products used in all our treatments.",
  "Salon Diamond is committed to providing exceptional service and personalized care to ensure a delightful experience.",
  "Whether you're preparing for a special occasion or just need a pampering session, Salon Diamond is your go-to destination for beauty and relaxation.",
  "Our team is here to help you achieve the perfect look with precision and style, making every visit memorable.",
  "If there's no info provided, respond as 'No info'. If there is, respond in less than 20 words with simple, direct answers."
];


// Route to handle user queries
router.post('/ask', async (req, res) => {
  console.log('Received request body:', req.body); // Log incoming request body
  console.log('Received request for /api/ask');

  const { message } = req.body;

  if (message.toLowerCase().trim() === 'exit') {
    res.json({ response: "Chatbot session ended." });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatHistory = [
      {
        role: "user",
        parts: [{ text: message }],
      },
      {
        role: "model",
        parts: hotelDescription.map(text => ({ text }))
      },
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log('Chatbot response:', text); // Log response text
    res.json({ response: text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ response: 'Error generating response' });
  }
});


export default router;
