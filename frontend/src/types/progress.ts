export interface ProgressEntry {
  id: string;
  userId: string;
  imageUrl: string;
  date: string; // Should be an ISO date string
  weight?: number;
  waist?: number;
  bodyFatPercentage?: number;
  // Adding a category tag as recommended
  category?: 'Front' | 'Side' | 'Back' | 'Other';
}