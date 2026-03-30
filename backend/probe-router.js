import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const hfToken = process.env.HUGGINGFACE_API_KEY;

async function probeRouter() {
    console.log(`Token: ${hfToken ? hfToken.substring(0, 5) + '...' : 'NONE'}`);
    
    const endpoints = [
        'https://router.huggingface.co/hf-inference/v1/chat/completions',
        'https://router.huggingface.co/v1/chat/completions',
        'https://api-inference.huggingface.co/v1/chat/completions'
    ];

    const models = [
        'meta-llama/Llama-3.2-1B-Instruct',
        'Qwen/Qwen2.5-1.5B-Instruct',
        'microsoft/Phi-3.5-mini-instruct',
        'google/gemma-2-2b-it'
    ];

    for (const endpoint of endpoints) {
        console.log(`\n--- Probing Endpoint: ${endpoint} ---`);
        for (const model of models) {
            try {
                const response = await axios.post(
                    endpoint,
                    {
                        model: model,
                        messages: [{ role: "user", content: "hi" }],
                        max_tokens: 10
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${hfToken}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );
                console.log(`✅ MATCH: Model: ${model} | Endpoint: ${endpoint}`);
                console.log(`Preview: ${response.data.choices[0].message.content}`);
                // If it works, we don't need to probe further for THIS endpoint
                break; 
            } catch (e) {
                console.log(`❌ FAIL: Model: ${model} | Status: ${e.response?.status} - ${JSON.stringify(e.response?.data).substring(0, 50)}`);
            }
        }
    }
}

probeRouter();
