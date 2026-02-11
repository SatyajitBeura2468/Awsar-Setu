import { GoogleGenerativeAI } from "@google/generative-ai";
// Notice: We removed SchemeType to fix the crash
import { Scheme, UserProfile } from './types';

// --- CONFIGURATION ---
// This safely grabs the key from Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Initialize AI only if key exists
let model: any = null;
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// --- HELPER: Clean AI Response ---
// This strips markdown (```json) to prevent crashing
const cleanJSON = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// --- FUNCTION 1: Get Schemes ---
export const getSchemes = async (userProfile: UserProfile): Promise<Scheme[]> => {
  // 1. Check if API Key is missing or invalid
  if (!API_KEY || !model) {
    console.warn("Using Demo Data (Missing API Key)");
    return getDemoSchemes();
  }

  try {
    const prompt = `
      You are an expert Indian Government Welfare guide.
      Analyze this user profile:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - State: ${userProfile.state}
      
      Return a JSON list of 5 real government schemes they are eligible for.
      Focus on schemes specific to ${userProfile.state} and Central Govt.
      Format strictly as this JSON array:
      [
        {
          "id": "1",
          "title": "Scheme Name",
          "provider": "Central or State Govt",
          "type": "Education/Health/Business", 
          "description": "Short description (max 20 words)",
          "eligibility": "One line eligibility",
          "benefits": "One line benefits"
        }
      ]
      IMPORTANT: Return ONLY the raw JSON. No markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = cleanJSON(response.text());

    return JSON.parse(text);

  } catch (error) {
    console.error("AI Error:", error);
    // FALLBACK: If AI fails, return Demo Data so app doesn't crash
    return getDemoSchemes();
  }
};

// --- FUNCTION 2: Chat ---
export const chatWithGemini = async (
  userMessage: string,
  schemeContext: any,
  chatHistory: any[]
): Promise<string> => {
  try {
    if (!API_KEY || !model) return "I am in Demo Mode. Please check your API Key in Vercel.";
    
    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "I am having trouble connecting. Please try again later.";
  }
};

// --- DEMO DATA (Safety Net) ---
// This shows up ONLY if the API Key is wrong/missing
const getDemoSchemes = (): Scheme[] => [
  {
    id: "demo-1",
    title: "National Scholarship Portal (Demo)",
    provider: "Central Govt",
    type: "Education",
    description: "System Alert: API Key is invalid. This is demo data.",
    eligibility: "Students above 18",
    benefits: "₹10,000 per year"
  },
  {
    id: "demo-2",
    title: "Odisha State Scholarship (Demo)",
    provider: "Odisha Govt",
    type: "Education",
    description: "Please fix Vercel Environment Variables to see real data.",
    eligibility: "Residents of Odisha",
    benefits: "Tuition waiver"
  }
];
