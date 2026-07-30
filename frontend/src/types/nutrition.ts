// src/types/nutrition.ts

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  timestamp: string; // ISO Date String
  nutrition: NutritionData;
  thumbnail?: string;
}