import axios from 'axios';

/**
 * Analyzes resume using Hugging Face Hub Router (Primary)
 * This uses the modern OpenAI-compatible endpoint.
 */
export const analyzeResumeWithHuggingFace = async (resumeText) => {
  const hfToken = process.env.HUGGINGFACE_API_KEY;
  const isPlaceholder = !hfToken || hfToken === 'your_huggingface_api_key_here';
  
  try {
    // Verified working model and ROUTER endpoint
    const model = 'Qwen/Qwen2.5-7B-Instruct'; 
    const apiUrl = `https://router.huggingface.co/v1/chat/completions`;

    const prompt = `You are an expert technical recruiter and resume reviewer. 
    Analyze the following resume text and provide a high-quality, professional evaluation.
      
    Evaluate based on:
    1. Technical Stack & Skills
    2. Project Impact & Quantifiable Results
    3. Formatting & Readability
    4. Professional Summary & Experience
      
    Respond ONLY with a valid JSON object in this exact format:
    {
        "score": <number 0-100>,
        "strengths": ["at least 3-4 detailed strengths"],
        "weaknesses": ["at least 2-3 specific areas for improvement"],
        "actionableFeedback": ["at least 3-4 concrete, numbered steps to improve the resume"],
        "summary": "A professional 2-sentence summary of the candidate's profile."
    }

    Resume Text:
    ${resumeText.substring(0, 4000)}`;

    const headers = {
        'Content-Type': 'application/json'
    };
    if (!isPlaceholder) {
      headers['Authorization'] = `Bearer ${hfToken}`;
    }

    const response = await axios.post(apiUrl, 
      { 
        model: model,
        messages: [
            { role: "system", content: "You are a resume analyzer that outputs only valid JSON. Be critical and professional." },
            { role: "user", content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.1
      },
      { headers, timeout: 60000 }
    );

    const content = response.data.choices[0].message.content;
    
    // Attempt to extract JSON
    try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const analysis = JSON.parse(jsonString);
        console.log('--- Real AI Analysis Generated ---');
        console.log(JSON.stringify(analysis, null, 2));
        return analysis;
    } catch (parseError) {
        console.error('HF JSON Parse error:', content);
        throw new Error('Invalid JSON structure from AI');
    }
  } catch (error) {
    if (error.response?.status === 401 || isPlaceholder) {
      console.log('--- HF API key missing or invalid, using Mock data ---');
    } else {
      console.error('Hugging Face API Error:', error.response?.data || error.message);
    }
    return getMockAnalysis();
  }
};

/**
 * Main AI Analysis Entry Point
 */
export const analyzeResume = async (resumeText) => {
  console.log('Using Hugging Face Hub Router (Qwen 2.5) for Resume Analysis...');
  return await analyzeResumeWithHuggingFace(resumeText);
};

const getMockAnalysis = () => {
    return {
      "score": 85,
      "strengths": [
        "Strong technical stack with MERN experience",
        "Clear project descriptions and quantifiable results",
        "Excellent formatting and readable layout"
      ],
      "weaknesses": [
        "Missing a clear professional summary at the top",
        "Could include more specific cloud deployment details"
      ],
      "actionableFeedback": [
        "Add a 3-sentence professional summary highlighting your years of experience",
        "Detail the specific AWS or Azure services used in your projects"
      ],
      "summary": "High-quality candidate with strong full-stack foundations. (Note: Falling back to mock data due to API issues)"
    };
};
