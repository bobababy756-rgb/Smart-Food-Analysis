import { GoogleGenAI, Type } from "@google/genai";
import { NutritionAnalysis, HealthRating } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
  You are a world-class nutritionist and food scientist. 
  Analyze the provided food image and estimate its nutritional content with high accuracy. 
  Provide a realistic estimate for a standard serving size shown in the image.
  Evaluate the healthiness based on sugar, saturated fat, and sodium levels generally associated with the food.
`;

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<NutritionAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this food image. Identify the food name, calories, macronutrients (protein, fat, sugar, carbs), key vitamins/minerals, and provide a health evaluation.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "The name of the identified food." },
            calories: { type: Type.NUMBER, description: "Estimated calories in kcal." },
            protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
            fat: { type: Type.NUMBER, description: "Estimated total fat in grams." },
            sugar: { type: Type.NUMBER, description: "Estimated sugar in grams." },
            carbs: { type: Type.NUMBER, description: "Estimated total carbohydrates in grams." },
            vitaminsAndMinerals: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of significant vitamins and minerals present."
            },
            healthEvaluation: { 
              type: Type.STRING, 
              enum: [HealthRating.GOOD, HealthRating.MEDIUM, HealthRating.HIGH_RISK],
              description: "Overall health evaluation."
            },
            summary: { type: Type.STRING, description: "A short, 2-sentence summary of the nutritional value." }
          },
          required: ["foodName", "calories", "protein", "fat", "sugar", "carbs", "vitaminsAndMinerals", "healthEvaluation", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    const data = JSON.parse(text) as NutritionAnalysis;
    return data;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};
