
import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

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
};
