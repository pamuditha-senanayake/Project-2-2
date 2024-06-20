import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Determine __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hotel information
const hotelDescription = [
  "Welcome to Serenity Hotel, ideally situated in the heart of the bustling city of Riverview.",
  "Our hotel offers 150 well-appointed rooms and suites, each designed to provide a luxurious retreat with modern amenities and breathtaking views of the city skyline or the serene riverfront.",
  "Guests can enjoy a variety of dining options at our on-site restaurant, Riverstone Grill, where Chef Smith showcases his culinary expertise with a menu featuring delectable dishes made from fresh, locally sourced ingredients.",
  "For a more casual experience, our Lounge Bar offers a relaxing atmosphere to unwind with crafted cocktails and light bites.",
  "Serenity Hotel is also equipped with state-of-the-art conference facilities, making it an ideal venue for business meetings and events.",
  "Our dedicated event planning team ensures every detail is meticulously handled to exceed expectations.",
  "Whether you're visiting for business or leisure, Serenity Hotel promises an unforgettable stay with impeccable service and a commitment to your comfort and satisfaction.",
  "if theres no info provided, respnd as no info, if there is then resond, and better keep in less than 20 words, and simple direct answers"
];

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory (for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Route to render the chatbot interface
app.get('/', (req, res) => {
  res.render('index', { message: null, response: null });
});

// Route to handle user queries
app.post('/ask', async (req, res) => {
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

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ response: 'Error generating response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
