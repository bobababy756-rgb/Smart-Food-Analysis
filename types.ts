export enum HealthRating {
  GOOD = 'Good',
  MEDIUM = 'Medium',
  HIGH_RISK = 'High Risk'
}

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  protein: number; // grams
  fat: number; // grams
  sugar: number; // grams
  carbs: number; // grams
  vitaminsAndMinerals: string[];
  healthEvaluation: HealthRating;
  summary: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  data: NutritionAnalysis;
}

export type ViewState = 'HOME' | 'RESULTS' | 'HISTORY';
