
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// The API key is injected at build time via process.env.GEMINI_API_KEY
const createAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.warn("MediMind: GEMINI_API_KEY is undefined in environment. Features may fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const geminiService = {
  async chat(message: string, context: string = "") {
    try {
      const ai = createAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction: context ? `${SYSTEM_INSTRUCTION}\n\nCURRENT CONTEXT: ${context}` : SYSTEM_INSTRUCTION,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Chat API Error:", error);
      throw error;
    }
  },

  async analyzeImage(imagePart: { inlineData: { data: string, mimeType: string } }, prompt: string) {
    try {
      const ai = createAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Image Analysis API Error:", error);
      throw error;
    }
  },

  async checkSymptoms(symptoms: string) {
    try {
      const ai = createAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these symptoms: ${symptoms}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nYou MUST return a JSON object explaining the situation. Be cautious and prioritize safety.",
          responseMimeType: "application/json",
          maxOutputTokens: 20000,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              urgency: { type: Type.STRING, enum: ['Emergency', 'High', 'Medium', 'Low'] },
              urgencyExplanation: { type: Type.STRING },
              potentialConditions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    likelihood: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "likelihood", "description"]
                }
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              disclaimer: { type: Type.STRING }
            },
            required: ["urgency", "urgencyExplanation", "potentialConditions", "recommendedActions", "disclaimer"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Symptom Analysis API Error:", error);
      throw error;
    }
  },

  async getMedicineInfo(medName: string) {
    try {
      const ai = createAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide detailed information for medicine: ${medName}.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              uses: { type: Type.ARRAY, items: { type: Type.STRING } },
              sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              interactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    substance: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] },
                    type: { type: Type.STRING, description: "e.g., Drug-Drug, Drug-Food, Drug-Alcohol" },
                    effect: { type: Type.STRING },
                    advice: { type: Type.STRING }
                  },
                  required: ["substance", "severity", "type", "effect", "advice"]
                }
              }
            },
            required: ["name", "uses", "sideEffects", "warnings", "interactions"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Medicine Info API Error:", error);
      throw error;
    }
  }
};
