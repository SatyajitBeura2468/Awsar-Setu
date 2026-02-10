import { GoogleGenAI, Type } from "@google/genai";
import { Scheme, UserProfile, SchemeType } from './types';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found in environment variables");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// Function to chat with the bot about a specific scheme
export const chatWithGemini = async (
  userMessage: string, 
  schemeContext: Scheme,
  chatHistory: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const client = getClient();
  if (!client) return "I'm sorry, I cannot connect to the AI service right now. Please check your API key.";

  const systemInstruction = `
    You are 'Awsar Sahayak', an expert AI assistant for the 'Awsar Setu' app.
    
    Current Scheme: "${schemeContext.title}" (${schemeContext.type} Scheme).
    Static Context Provided:
    - Description: ${schemeContext.description}
    - Benefits: ${schemeContext.benefits.join(', ')}
    - Eligibility: ${schemeContext.eligibility.join(', ')}
    
    YOUR MANDATE:
    1. You have access to Google Search. You MUST use it to find the **absolute latest, real-time information** about this scheme.
    2. Do NOT rely solely on the provided context if it might be outdated. Verify deadlines, new eligibility rules, and application links.
    3. If the user asks for application steps, provide the current official method found online.
    4. Keep answers concise, friendly, and structured (bullet points).
    5. Be Indian-citizen friendly (Namaste, clear English).
  `;

  try {
    const model = 'gemini-3-flash-preview'; 
    const response = await client.models.generateContent({
      model: model,
      contents: [
        ...chatHistory.map(msg => ({ role: msg.role, parts: msg.parts })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text || "I didn't catch that. Could you please rephrase?";

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      const links = chunks
        .map((c: any) => c.web?.uri && c.web?.title ? `[${c.web.title}](${c.web.uri})` : null)
        .filter(Boolean);
        
      if (links.length > 0) {
        const uniqueLinks = [...new Set(links)];
        text += `\n\n**Sources:**\n${uniqueLinks.map(link => `- ${link}`).join('\n')}`;
      }
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble fetching the latest updates right now. Please try again later.";
  }
};

// New function to discover live schemes based on user profile
export const fetchLiveSchemes = async (user: UserProfile): Promise<Scheme[]> => {
  const client = getClient();
  if (!client) return [];

  const prompt = `
    Act as a government data bridge. Search for and list currently active government schemes for a ${user.age} year old person residing in ${user.location}, India.
    
    Search Strategy:
    1. Find Central Government Schemes (Pradhan Mantri...) active now.
    2. Find State Government Schemes specifically for ${user.location}.
    3. Ensure schemes are relevant to: Education, Employment, Housing, Health, or Financial inclusion.

    Constraint: Return at least 8 distinct schemes.
    
    For each scheme, extract:
    - Exact Title
    - Type ("Central" or "State")
    - Description (Concise, 2 sentences)
    - Tags (Keywords like "Student", "Farmer", "Housing")
    - MinAge and MaxAge (Numeric estimates based on eligibility)
    
    (Note: If exact benefits or process are not immediately available in the list view, leave them as empty arrays. We will fetch details later.)

    Output must be a valid JSON array matching the schema.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["Central", "State"] },
              state: { type: Type.STRING },
              description: { type: Type.STRING },
              benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
              eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
              applicationProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              minAge: { type: Type.NUMBER },
              maxAge: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Sanitize and format data
    return rawData.map((s: any, index: number) => ({
        id: s.id || `live-${Date.now()}-${index}`,
        title: s.title || "Government Scheme",
        type: s.type === "Central" ? SchemeType.CENTRAL : SchemeType.STATE,
        state: s.type === "State" ? (s.state || user.location) : undefined,
        description: s.description || "Description unavailable.",
        benefits: s.benefits || [],
        eligibility: s.eligibility || [],
        applicationProcess: s.applicationProcess || [],
        tags: s.tags || ["General"],
        minAge: s.minAge,
        maxAge: s.maxAge
    }));

  } catch (error) {
    console.error("Error fetching live schemes:", error);
    return [];
  }
};

// Deep dive fetch for a specific scheme
export const fetchSchemeDetails = async (scheme: Scheme): Promise<Scheme> => {
  const client = getClient();
  if (!client) return scheme;

  const prompt = `
    Research the following government scheme in depth using Google Search:
    Title: "${scheme.title}"
    State/Context: ${scheme.type === SchemeType.STATE ? scheme.state : 'Central India'}

    Find the OFFICIAL details for:
    1. Comprehensive list of Benefits (Financial amounts, subsidies, etc.)
    2. Detailed Eligibility Criteria (Who can apply?)
    3. Step-by-step Application Process (Online portal names, offline methods)
    4. A more detailed Description if the current one is short.

    Output pure JSON matching the Scheme object structure.
    Ensure 'benefits', 'eligibility', and 'applicationProcess' are populated arrays.
  `;

  try {
     const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
            applicationProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        }
      }
    });

    const details = JSON.parse(response.text || "{}");
    
    return {
      ...scheme,
      description: details.description || scheme.description,
      benefits: (details.benefits && details.benefits.length > 0) ? details.benefits : scheme.benefits,
      eligibility: (details.eligibility && details.eligibility.length > 0) ? details.eligibility : scheme.eligibility,
      applicationProcess: (details.applicationProcess && details.applicationProcess.length > 0) ? details.applicationProcess : scheme.applicationProcess,
    };

  } catch (error) {
    console.error("Error fetching scheme details:", error);
    return scheme;
  }
}
