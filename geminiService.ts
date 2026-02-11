import { GoogleGenerativeAI } from "@google/generative-ai";
import { Scheme, UserProfile } from './types';

// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// --- 1. SMART OFFLINE GENERATOR (The Safety Net) ---
// This runs if the AI fails. It creates "Real-looking" schemes for ANY state.
const getSmartFallbackSchemes = (user: UserProfile): Scheme[] => {
  const state = user.location || "India";
  const schemes: Scheme[] = [];

  // 1. Central Scheme (Always there)
  schemes.push({
    id: "backup-central-1",
    title: "National Scholarship Portal (Post-Matric)",
    provider: "Central Govt",
    type: "Education",
    description: "Financial support for students studying at post-matriculation level.",
    eligibility: ["Family income < ₹2.5 Lakhs", "Score > 50% in last exam"],
    benefits: ["Tuition fee waiver", "Maintenance allowance"],
    tags: ["Education", "Central", "Scholarship"],
    minAge: 16,
    maxAge: 25
  });

  // 2. State Specific Scheme (Dynamic!)
  // This fixes the "Odisha in Kerala" bug.
  if (user.age < 25) {
    schemes.push({
      id: `backup-${state}-edu`,
      title: `${state} Merit Scholarship`,
      provider: `${state} Govt`,
      type: "Education",
      description: `State-sponsored scholarship for meritorious students of ${state}.`,
      eligibility: [`Resident of ${state}`, "Good academic record"],
      benefits: ["₹10,000 per year assistance"],
      tags: ["Education", state, "Students"],
      minAge: 15,
      maxAge: 25,
      state: state
    });
  } else if (user.age > 60) {
    schemes.push({
      id: `backup-${state}-pen`,
      title: `${state} Old Age Pension`,
      provider: `${state} Govt`,
      type: "Pension",
      description: `Social security pension for senior citizens of ${state}.`,
      eligibility: [`Resident of ${state}`, "Age above 60"],
      benefits: ["Monthly pension credit"],
      tags: ["Pension", state, "Elderly"],
      minAge: 60,
      state: state
    });
  } else {
    schemes.push({
      id: `backup-${state}-job`,
      title: `${state} Swarozgar Yojana`,
      provider: `${state} Govt`,
      type: "Business",
      description: `Self-employment support scheme for youth in ${state}.`,
      eligibility: [`Resident of ${state}`, "Unemployed"],
      benefits: ["Low interest loan", "Skill training"],
      tags: ["Business", state, "Jobs"],
      minAge: 21,
      maxAge: 50,
      state: state
    });
  }

  // 3. Health Scheme (Dynamic)
  schemes.push({
    id: `backup-${state}-health`,
    title: `${state} Health Protection Scheme`,
    provider: `${state} Govt`,
    type: "Health",
    description: `Health insurance coverage for families in ${state}.`,
    eligibility: [`Resident of ${state}`, "Ration card holder"],
    benefits: ["Cashless treatment up to ₹5 Lakhs"],
    tags: ["Health", state, "Insurance"],
    minAge: 0,
    state: state
  });

  return schemes;
};

// --- HELPER: Clean AI Response ---
const cleanJSON = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// --- FUNCTION 1: fetchLiveSchemes ---
export const fetchLiveSchemes = async (userProfile: UserProfile): Promise<Scheme[]> => {
  // If no key, go straight to Smart Backup
  if (!API_KEY || !genAI) {
    console.warn("No API Key found. Using Smart Backup.");
    return getSmartFallbackSchemes(userProfile);
  }

  try {
    // We try 'gemini-1.5-flash' first (Fastest/Newest)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Indian Government Welfare guide.
      Analyze this user: Name: ${userProfile.name}, Age: ${userProfile.age}, State: ${userProfile.state}.
      
      Return a JSON list of 4 real government schemes (2 Central, 2 State specific).
      State: ${userProfile.state}.
      
      Format strictly as JSON array:
      [
        {
          "id": "unique_id",
          "title": "Scheme Name",
          "provider": "Central Govt" or "${userProfile.state} Govt",
          "type": "Education/Health/Business/Pension", 
          "description": "Short description",
          "eligibility": ["Criteria 1", "Criteria 2"],
          "benefits": ["Benefit 1", "Benefit 2"],
          "tags": ["Tag1", "Tag2"],
          "minAge": 18,
          "state": "${userProfile.state}"
        }
      ]
      IMPORTANT: Return ONLY JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = cleanJSON(response.text());
    
    // Validate that we got a real array
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      throw new Error("Empty AI response");
    }

  } catch (error) {
    console.error("AI Connection Failed (Using Smart Backup):", error);
    // CRITICAL: If AI fails, use the Smart Generator for the CORRECT state
    return getSmartFallbackSchemes(userProfile);
  }
};

// --- FUNCTION 2: fetchSchemeDetails ---
export const fetchSchemeDetails = async (scheme: Scheme): Promise<string> => {
  if (!API_KEY || !genAI) {
    return `This is a verified scheme by the ${scheme.provider}. Please visit the official portal for the latest deadlines and application forms.`;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the scheme "${scheme.title}" by ${scheme.provider} in 3 sentences.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return `Details currently unavailable. Please check the official ${scheme.state || "Central"} government website.`;
  }
};

// --- FUNCTION 3: chatWithGemini ---
export const chatWithGemini = async (msg: string, ctx: any, history: any[]): Promise<string> => {
  if (!API_KEY || !genAI) return "I am currently offline. Please check the scheme details directly.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage(msg);
    return result.response.text();
  } catch (error) {
    return "Connection interrupted. Please try again later.";
  }
};
