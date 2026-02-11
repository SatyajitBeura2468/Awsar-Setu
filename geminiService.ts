import { GoogleGenerativeAI } from "@google/generative-ai";
import { Scheme, UserProfile } from './types';

// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let model: any = null;
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  // FIX: Using 'gemini-pro' because it is the most stable model
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

// --- HELPER: Clean AI Response ---
const cleanJSON = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// --- FUNCTION 1: fetchLiveSchemes ---
export const fetchLiveSchemes = async (userProfile: UserProfile): Promise<Scheme[]> => {
  // Check if API Key or Model is missing
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
          "provider": "Central Govt", 
          "type": "Education", 
          "description": "Short description (max 20 words)",
          "eligibility": ["One line eligibility"],
          "benefits": ["One line benefits"],
          "tags": ["Tag1", "Tag2"]
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
    return getDemoSchemes();
  }
};

// --- FUNCTION 2: fetchSchemeDetails ---
export const fetchSchemeDetails = async (scheme: Scheme): Promise<string> => {
  if (!API_KEY || !model) return "Demo Details: Please add API Key to see real AI analysis.";
  
  try {
    const prompt = `Give me a detailed 3-line summary of the scheme: ${scheme.title} (${scheme.provider}).`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Could not fetch details.";
  }
};

// --- FUNCTION 3: chatWithGemini ---
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

// --- DEMO DATA (Fallback) ---
const getDemoSchemes = (): Scheme[] => [
  {
    id: "demo-1",
    title: "National Scholarship Portal (Demo)",
    provider: "Central Govt",
    type: "Education",
    description: "System Alert: API connection failed. Showing demo data.",
    eligibility: ["Students above 18"],
    benefits: ["₹10,000 per year"],
    tags: ["Education", "Scholarship"]
  },
  {
    id: "demo-2",
    title: "Odisha State Scholarship (Demo)",
    provider: "Odisha Govt",
    type: "Education",
    description: "Please check console for details.",
    eligibility: ["Residents of Odisha"],
    benefits: ["Tuition waiver"],
    tags: ["Education", "Odisha"]
  }
];
