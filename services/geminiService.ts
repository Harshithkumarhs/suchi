import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

export const getRecipeSuggestions = async (items: CartItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const itemNames = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 2 delightful, nutrient-rich recipes for these items: ${itemNames}. Format with clear headers and bullet points.`,
    config: {
      temperature: 0.9,
      maxOutputTokens: 800,
    },
  });

  return response.text;
};

export const getCookingTip = async (productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Give me a one-sentence tip to keep organic ${productName} fresh for longer.`,
  });
  return response.text;
};