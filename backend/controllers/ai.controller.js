import fetch from "node-fetch";
import asyncHandler from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export const chatWithGemini = async (req, res) => {
  console.log("✅ Received a request at /api/ai/chat");
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("❌ FATAL: Gemini API key is not configured.");
      return res.status(500).json({ error: "API key is not configured." });
    }

    const model = "gemini-2.5-flash-lite"; // Using latest model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful health and fitness assistant for HealthBloom. Provide concise, helpful advice. Please format your responses using markdown for clarity (e.g., use **bold** for titles and * for bullet points). User message: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error:", data.error);
      throw new Error(
        data.error?.message || "Failed to generate response from Gemini API"
      );
    }

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";
    res.json({ response: aiResponse });
  } catch (error) {
    if (error.name === "AbortError") {
      res
        .status(500)
        .json({ error: "The connection to the AI service timed out." });
    } else {
      res
        .status(500)
        .json({ error: "Sorry, an internal server error occurred." });
    }
  }
};


// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to convert buffer to Gemini-compatible format
const fileToGenerativePart = (buffer, mimeType) => {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
};

/**
 * Reusable function to get nutrition data and format it with Gemini
 */
const getAndFormatNutritionData = async (query) => {
  // --- Step 1: Get nutrition data from Nutritionix ---
  const nutritionixResponse = await axios.post(
    'https://trackapi.nutritionix.com/v2/natural/nutrients',
    { query },
    {
      headers: {
        'x-app-id': process.env.NUTRITIONIX_APP_ID,
        'x-app-key': process.env.NUTRITIONIX_APP_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const nutritionData = nutritionixResponse.data;

  if (!nutritionData || !nutritionData.foods || nutritionData.foods.length === 0) {
    const error = new Error(`Could not find nutritional information for: ${query}`);
    error.statusCode = 404;
    throw error;
  }

  // --- Step 2: Format the response with Gemini Text model ---
  const textModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });
  const formattingPrompt = `
    Format the following nutritional data from Nutritionix into a clean JSON object.
    The JSON should have two keys: "summary" (a friendly, one-sentence summary for the user) and "items" (an array of food objects).
    Each object in the "items" array must have these exact keys: "name", "calories", "protein", "carbs", and "fat".
    Round all nutritional values to the nearest whole number.
    Here is the raw data: ${JSON.stringify(nutritionData)}
    
    Example output format:
    {
      "summary": "This looks like a balanced meal with good protein.",
      "items": [
        { "name": "chicken breast", "calories": 165, "protein": 31, "carbs": 0, "fat": 4 },
        { "name": "broccoli", "calories": 55, "protein": 4, "carbs": 11, "fat": 1 }
      ]
    }
  `;

  const formattingResult = await textModel.generateContent(formattingPrompt);
  const formattedResponseText = formattingResult.response.text();
  
  const jsonString = formattedResponseText.replace(/```json\n|```/g, '').trim();
  return JSON.parse(jsonString);
};


/**
 * @desc    Analyzes a food image to get nutritional information
 * @route   POST /api/ai/scan-food
 * @access  Private
 */
export const scanFoodImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded.');
  }

  const visionModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });
  const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

  const visionPrompt = "Identify the food items in this image. List them in a simple, comma-separated string, for example: '1 apple, 2 slices of bread, 1 glass of milk'. Be concise.";
  
  const visionResult = await visionModel.generateContent([visionPrompt, imagePart]);
  const foodQuery = visionResult.response.text();

  if (!foodQuery) {
    res.status(500);
    throw new Error('AI could not identify the food in the image.');
  }
  
  const finalJson = await getAndFormatNutritionData(foodQuery);
  res.status(200).json(finalJson);
});

/**
 * @desc    Analyzes a food text query to get nutritional information
 * @route   POST /api/ai/analyze-text
 * @access  Private
 */
export const analyzeFoodText = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400);
    throw new Error('Search query is required.');
  }

  const finalJson = await getAndFormatNutritionData(query);
  res.status(200).json(finalJson);
});