<<<<<<< HEAD
import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

=======

import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

<<<<<<< HEAD


>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
export const getRecipeSuggestions = async (items: CartItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const itemNames = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
<<<<<<< HEAD
    contents: `Suggest 2 delightful, nutrient-rich recipes for these items: ${itemNames}. Format with clear headers and bullet points.`,
    config: {
      temperature: 0.9,
      maxOutputTokens: 800,
=======
    contents: `You are the Suchi Smart Chef. A customer has bought these 100% organic items: ${itemNames}. 
    Suggest 2 unique, healthy, and easy-to-cook recipes using these ingredients. 
    Focus on retaining the organic nutrients. Format as clear, friendly markdown.`,
    config: {
      temperature: 0.8,
      maxOutputTokens: 600,
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
    },
  });

  return response.text;
};

export const getCookingTip = async (productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
<<<<<<< HEAD
    contents: `Give me a one-sentence tip to keep organic ${productName} fresh for longer.`,
  });
  return response.text;
};
=======
    contents: `As a professional chef at Suchi Farms, give me a one-sentence pro tip for storing or preparing organic ${productName} to maximize flavor.`,
  });
  return response.text;
=======
export const getMealSuggestions = async (cart: CartItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const cartDescription = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
  
  const prompt = `I have the following organic vegetables in my cart: ${cartDescription}. 
  Can you suggest 3 quick, healthy, and organic meal recipes I can make with these? 
  Keep it concise and focus on the health benefits of these organic ingredients.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert organic chef and nutritionist. You help users plan meals specifically using organic vegetables. You emphasize freshness, health, and minimal waste.",
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't generate suggestions right now. Try adding more items!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Shuchi AI is resting. Please try again later.";
  }
>>>>>>> d9df6bdae344ebbca08512848b9b5efdee8d684c
};
>>>>>>> a3cf91270435a2c72635c2e81620606897ed6fe7
