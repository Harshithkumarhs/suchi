
import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

/**
 * Suchi AI Core
 * Powered by Gemini to provide human-like recipe suggestions 
 * based on pure organic ingredients.
 */

export const getRecipeSuggestions = async (items: CartItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const itemNames = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are the Suchi Smart Chef. A customer has bought these 100% organic items: ${itemNames}. 
    Suggest 2 unique, healthy, and easy-to-cook recipes using these ingredients. 
    Focus on retaining the organic nutrients. Format as clear, friendly markdown.`,
    config: {
      temperature: 0.8,
      maxOutputTokens: 600,
    },
  });

  return response.text;
};

export const getCookingTip = async (productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a professional chef at Suchi Farms, give me a one-sentence pro tip for storing or preparing organic ${productName} to maximize flavor.`,
  });
  return response.text;
};
