
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const explainCode = async (phpCode: string): Promise<string> => {
  if (!API_KEY) return "API Key not found. Please ensure it is configured.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the following PHP code logic and what it does in a concise, developer-friendly way. Mention any potential security issues or improvements: \n\n\`\`\`php\n${phpCode}\n\`\`\``,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
    return response.text || "No explanation provided.";
  } catch (error) {
    console.error("Error explaining code:", error);
    return "Failed to generate explanation. Please check the console.";
  }
};
