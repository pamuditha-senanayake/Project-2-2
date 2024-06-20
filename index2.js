import dotenv from "dotenv";
import axios from "axios";
import OpenAI from 'openai';

dotenv.config();



const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });
  
  async function main() {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    });
  }
  
  main();


//   import dotenv from "dotenv";
// import OpenAI from 'openai';

// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const knowledge = `
// The company's name is OpenAI. 
// OpenAI is a research organization that focuses on developing and promoting friendly AI.
// OpenAI was founded in December 2015.
// The mission of OpenAI is to ensure that artificial general intelligence (AGI) benefits all of humanity.
// `;

// async function main() {
//     try {
//         const chatCompletion = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 { role: 'system', content: knowledge },
//                 { role: 'user', content: 'Say this is a test' }
//             ],
//         });

//         const fullResponse = chatCompletion.choices[0].message.content.trim();
//         console.log(`Q: Say this is a test\nA: ${fullResponse}`);
//     } catch (error) {
//         console.error('Error querying OpenAI:', error.message);
//     }
// }

// main();
