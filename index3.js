import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import readline from 'readline';
dotenv.config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Hotel information
const hotelDescription = [
  "Welcome to Serenity Hotel, ideally situated in the heart of the bustling city of Riverview.",
  "Our hotel offers 150 well-appointed rooms and suites, each designed to provide a luxurious retreat with modern amenities and breathtaking views of the city skyline or the serene riverfront.",
  "Guests can enjoy a variety of dining options at our on-site restaurant, Riverstone Grill, where Chef Smith showcases his culinary expertise with a menu featuring delectable dishes made from fresh, locally sourced ingredients.",
  "For a more casual experience, our Lounge Bar offers a relaxing atmosphere to unwind with crafted cocktails and light bites.",
  "Serenity Hotel is also equipped with state-of-the-art conference facilities, making it an ideal venue for business meetings and events.",
  "Our dedicated event planning team ensures every detail is meticulously handled to exceed expectations.",
  "Whether you're visiting for business or leisure, Serenity Hotel promises an unforgettable stay with impeccable service and a commitment to your comfort and satisfaction."
];

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Welcome to the hotel chatbot. You can type your questions or type 'exit' to quit.");

  rl.on('line', async (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      rl.close();
      console.log("Exiting...");
      return;
    }

    const chatHistory = [
      {
        role: "user",
        parts: [{ text: input }],
      },
      {
        role: "model",
        parts: hotelDescription.map(text => ({ text })) // Include hotel description parts
      },
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(input);
    const response = await result.response;
    const text = response.text();
    console.log("Chatbot:", text);
  });

  rl.on('close', () => {
    console.log("Chatbot session ended.");
    process.exit(0);
  });
}

run();
