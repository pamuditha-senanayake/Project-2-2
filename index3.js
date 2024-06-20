import { GoogleGenerativeAI } from '@google/generative-ai';
import env from "dotenv";
env.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = 'Write about sri lanka in 30 words';

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();