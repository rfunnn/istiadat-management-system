
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const getOwnerInsights = async (state: AppState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze this wedding hall booking data and provide a concise summary for the hall owner.
    Bookings: ${JSON.stringify(state.bookings)}
    Viewings: ${JSON.stringify(state.viewings)}
    
    Provide:
    1. A summary of pending actions (approvals needed).
    2. Occupancy rate assessment.
    3. Revenue projection based on approved bookings.
    4. One strategic tip for the upcoming month.
    
    Format the response as a clear, professional report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time. Please check your data manually.";
  }
};
