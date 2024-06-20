import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const openaiUrl = 'https://api.openai.com/v1/chat/completions';

const knowledge = `
The company's name is OpenAI. 
OpenAI is a research organization that focuses on developing and promoting friendly AI.
OpenAI was founded in December 2015.
The mission of OpenAI is to ensure that artificial general intelligence (AGI) benefits all of humanity.
`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const askQuestion = async (question, retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    try {
        const response = await axios.post(
            openaiUrl,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: knowledge },
                    { role: 'user', content: `Q: ${question}` }
                ],
                max_tokens: 50,
                temperature: 0.5,
                n: 1,
                stop: ['\n']
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const fullResponse = response.data.choices[0].message.content.trim();
        console.log(`Q: ${question}\nA: ${fullResponse}`);
    } catch (error) {
        if (error.response) {
            if (error.response.status === 429 && retryCount < maxRetries) {
                console.warn(`Rate limit exceeded, retrying in ${retryDelay / 1000} seconds...`);
                await delay(retryDelay);
                return askQuestion(question, retryCount + 1);
            }
            console.error(`Error querying OpenAI: ${error.response.status} - ${error.response.statusText}`);
            console.error(`Message: ${error.response.data.error.message}`);
        } else {
            console.error(`Error querying OpenAI: ${error.message}`);
        }
    }
};

// Example usage
askQuestion('What is the name of the company?');
askQuestion('When was OpenAI founded?');
askQuestion('What is the mission of OpenAI?');
