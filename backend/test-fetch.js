import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY.trim();
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function testFetch() {
  console.log('Fetching model list from:', url.replace(apiKey, 'REDACTED'));
  try {
    const response = await fetch(url);
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

testFetch();
