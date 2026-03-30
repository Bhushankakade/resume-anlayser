import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testWithVer(ver) {
  console.log(`\n--- TESTING WITH API VERSION: ${ver} ---`);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  
  const models = [
    'gemini-1.5-flash',
    'models/gemini-1.5-flash',
    'gemini-pro',
    'models/gemini-pro'
  ];
  
  for (const name of models) {
    try {
      console.log(`Testing: ${name}...`);
      // Trying both ways to pass apiVersion
      const model = genAI.getGenerativeModel({ model: name }, { apiVersion: ver });
      const result = await model.generateContent('Say hello');
      console.log(`✅ SUCCESS: ${name} (${ver}) works!`);
      return true;
    } catch (error) {
      console.log(`❌ FAILED: ${name} (${ver}) - ${error.message.substring(0, 60)}...`);
    }
  }
  return false;
}

async function runDiagnostics() {
  const v1Success = await testWithVer('v1');
  if (!v1Success) {
    await testWithVer('v1beta');
  }
}

runDiagnostics();
