import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, RotateCcw, Loader2 } from 'lucide-react';
import { EnhancedWaterTracker } from "@/components/meals/EnhancedWaterTracker";
import { EnhancedFoodDatabase, FoodItem } from "@/components/meals/EnhancedFoodDatabase";
import { AddMealModal } from "@/components/modals/AddMealModal";
import { CameraModal } from '@/components/modals/CameraModal';
import { Meal, NutritionData } from '@/types/nutrition';
import { DateNavigator } from '@/components/meals/DateNavigator';
import { ScrollableTimeline } from '@/components/meals/ScrollableTimeline';
import { DailyNutritionSummary } from '@/components/meals/DailyNutritionSummary';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { ScannedFoodResult, ScannedData } from '@/components/meals/ScannedFoodResult';

// --- MOCK DATA ---
const foodDatabase: FoodItem[] = [
  { id: 'f1', name: 'Chicken Breast (Grilled)', serving: '100g', nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, category: 'Protein', nutritionScore: 5, isFavorite: false },
  { id: 'f2', name: 'Brown Rice (Cooked)', serving: '100g', nutrition: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 }, category: 'Grains', nutritionScore: 4, isFavorite: true },
  { id: 'f3', name: 'Broccoli (Steamed)', serving: '100g', nutrition: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 }, category: 'Vegetables', nutritionScore: 5, isFavorite: false },
];
const mealPlans = [
  { id: 'mp1', name: 'High Protein Plan', description: 'Perfect for muscle building and recovery', calories: 2400, macros: { protein: 180, carbs: 220, fat: 65 } },
  { id: 'mp2', name: 'Weight Loss Plan', description: 'Calorie deficit with balanced nutrition', calories: 1800, macros: { protein: 135, carbs: 165, fat: 50 } },
];

const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const Meals = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // --- States for targets, modals, data etc. ---
  const NUTRITION_TARGET_KEY = 'dailyNutritionTarget';
  const [dailyTarget, setDailyTarget] = useState<NutritionData>(() => {
    try {
      const savedTarget = localStorage.getItem(NUTRITION_TARGET_KEY);
      return savedTarget ? JSON.parse(savedTarget) : { calories: 2200, protein: 130, carbs: 240, fat: 70 };
    } catch (error) {
      console.error("Failed to parse nutrition target from localStorage", error);
      return { calories: 2200, protein: 130, carbs: 240, fat: 70 };
    }
  });
  useEffect(() => {
    localStorage.setItem(NUTRITION_TARGET_KEY, JSON.stringify(dailyTarget));
  }, [dailyTarget]);

  const handleTargetChange = (newCalories: number) => {
    setDailyTarget(currentTarget => ({ ...currentTarget, calories: newCalories }));
    toast({ title: "Calorie Goal Updated!", description: `Your new daily goal is ${newCalories} kcal.` });
  };

  const [addMealModalOpen, setAddMealModalOpen] = useState(false);
  const [editMealModalOpen, setEditMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [foods, setFoods] = useState(foodDatabase);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [prefilledHour, setPrefilledHour] = useState<number | null>(null);
  const [mealsForSelectedDay, setMealsForSelectedDay] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE for AI Analysis (Camera & Search) ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScannedData | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    const fetchMeals = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const dateKey = getDateKey(selectedDate);
        const { data } = await api.get<Meal[]>(`/meals?date=${dateKey}`);
        setMealsForSelectedDay(data);
      } catch (error) {
        toast({ title: "Error fetching meals", description: "Could not load meal data.", variant: "destructive" });
        setMealsForSelectedDay([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeals();
  }, [selectedDate, currentUser, toast]);

  // --- API HANDLERS ---
  const handleAddMeal = async (mealData: any) => {
    const newMealTimestamp = new Date(selectedDate);
    newMealTimestamp.setHours(prefilledHour ?? new Date().getHours(), new Date().getMinutes());

    const mealPayload = {
      name: mealData.name,
      timestamp: newMealTimestamp.toISOString(),
      nutrition: {
        calories: parseInt(mealData.calories) || 0, protein: parseInt(mealData.protein) || 0,
        carbs: parseInt(mealData.carbs) || 0, fat: parseInt(mealData.fat) || 0,
      }
    };
    try {
      const { data: newMeal } = await api.post<Meal>('/meals', mealPayload);
      setMealsForSelectedDay(prev => [...prev, newMeal].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      toast({ title: "Meal Added Successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add meal.", variant: "destructive" });
    } finally {
      setPrefilledHour(null);
    }
  };

  const handleUpdateMeal = async (updatedMealData: any) => {
    if (!editingMeal) return;

    const payload = {
      name: updatedMealData.name,
      nutrition: {
        calories: parseInt(updatedMealData.calories) || 0,
        protein: parseInt(updatedMealData.protein) || 0,
        carbs: parseInt(updatedMealData.carbs) || 0,
        fat: parseInt(updatedMealData.fat) || 0,
      }
    };

    try {
      const { data: updatedMeal } = await api.put<Meal>(`/meals/${editingMeal.id}`, payload);
      setMealsForSelectedDay(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
      toast({ title: "Meal Updated Successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update meal.", variant: "destructive" });
    } finally {
      setEditMealModalOpen(false);
      setEditingMeal(null);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    const mealToDelete = mealsForSelectedDay.find(m => m.id === id);
    if (mealToDelete && window.confirm(`Are you sure you want to delete "${mealToDelete.name}"?`)) {
      try {
        await api.delete(`/meals/${id}`);
        setMealsForSelectedDay(prev => prev.filter(meal => meal.id !== id));
        toast({ title: "Meal Deleted" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete meal.", variant: "destructive" });
      }
    }
  };

  const handleResetDay = async () => {
    if (window.confirm('Are you sure you want to clear all meals for this day?')) {
      try {
        const dateKey = getDateKey(selectedDate);
        await api.delete(`/meals?date=${dateKey}`);
        setMealsForSelectedDay([]); // Clear the state immediately
        toast({ title: "Meals Cleared for this Day" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to reset meals for the day.", variant: "destructive" });
      }
    }
  };

  // --- HANDLERS for AI-based Food Analysis ---

  // For Camera Scan
  const handlePhotoCapture = async (imageSrc: string) => {
    setIsCameraOpen(false);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append('foodImage', blob, 'scan.jpg');
      const { data } = await api.post<ScannedData>('/ai/scan-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(data);
      toast({ title: "Image Analysis Complete!", description: "Review the nutritional information below." });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to analyze image.";
      setAnalysisError(errorMessage);
      toast({ title: "Analysis Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // For Text Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const { data } = await api.post<ScannedData>('/ai/analyze-text', { query: searchQuery });
      setAnalysisResult(data);
      toast({ title: "Search Analysis Complete!", description: "Review the nutritional information below." });
      setSearchQuery(""); // Clear input on success
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to analyze search query.";
      setAnalysisError(errorMessage);
      toast({ title: "Analysis Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // For adding the result (from either camera or text) as a meal
  const handleAddAnalyzedMeal = async (mealData: { name: string; nutrition: NutritionData }) => {
    const newMealTimestamp = new Date(selectedDate);
    newMealTimestamp.setHours(new Date().getHours(), new Date().getMinutes());
    const mealPayload = { name: mealData.name, timestamp: newMealTimestamp.toISOString(), nutrition: mealData.nutrition };
    try {
      const { data: newMeal } = await api.post<Meal>('/meals', mealPayload);
      setMealsForSelectedDay(prev => [...prev, newMeal].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      toast({ title: "Analyzed Meal Added Successfully!" });
      setAnalysisResult(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add analyzed meal.", variant: "destructive" });
    }
  };

  // --- UI-ONLY HANDLERS ---
  const handleAddMealClick = (hour: number) => { setPrefilledHour(hour); setAddMealModalOpen(true); };
  const handleEditMeal = (meal: Meal) => { setEditingMeal(meal); setEditMealModalOpen(true); };
  const handleToggleFavorite = (id: string) => { setFoods(foods.map(food => food.id === id ? { ...food, isFavorite: !food.isFavorite } : food)); };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Meal Planner</h1>
          <p className="text-muted-foreground">Track your nutrition and plan your meals</p>
        </div>
        <Button variant="outline" onClick={handleResetDay}><RotateCcw className="h-4 w-4 mr-2" />Reset Day</Button>
      </div>

      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailyNutritionSummary dailyTarget={dailyTarget} meals={mealsForSelectedDay} onTargetChange={handleTargetChange} />
        </div>
        <EnhancedWaterTracker />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 rounded-lg bg-muted/50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <ScrollableTimeline meals={mealsForSelectedDay} onAddMeal={handleAddMealClick} onEditMeal={handleEditMeal} onDeleteMeal={handleDeleteMeal} />
      )}

      {/* --- Section for AI Analysis Results (unified for camera and search) --- */}
      {isAnalyzing && (
        <div className="flex flex-col justify-center items-center h-40 rounded-lg bg-muted/50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Analyzing your food, please wait...</p>
        </div>
      )}
      {analysisError && !isAnalyzing && (
        <div className="p-4 text-center text-destructive-foreground bg-destructive rounded-md">
          <p><strong>Error:</strong> {analysisError}</p>
        </div>
      )}
      {analysisResult && !isAnalyzing && (
        <ScannedFoodResult
          data={analysisResult}
          onAddMeal={handleAddAnalyzedMeal}
          onClear={() => {
            setAnalysisResult(null);
            setAnalysisError(null);
          }}
        />
      )}

      <Tabs defaultValue="food-database">
        <TabsList className="mb-6">
          <TabsTrigger value="food-database">Food Database</TabsTrigger>
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="favorites">Favorite Foods</TabsTrigger>
        </TabsList>
        <TabsContent value="food-database" className="mt-0">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 mb-6">
            <input
              type="search"
              placeholder="Search foods like 'an apple and 2 eggs' and press Enter"
              className="flex-grow p-2 rounded-md bg-muted border border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isAnalyzing}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCameraOpen(true)}
              title="Scan food with camera"
              disabled={isAnalyzing}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </form>
          <EnhancedFoodDatabase foods={foods} onAddFood={() => { }} onToggleFavorite={handleToggleFavorite} />
        </TabsContent>
        <TabsContent value="meal-plans" className="mt-0"><p className="text-muted-foreground">Meal plan features coming soon!</p></TabsContent>
        <TabsContent value="favorites" className="mt-0"><p className="text-muted-foreground">Favorite foods features coming soon!</p></TabsContent>
      </Tabs>

      {/* --- MODALS --- */}
      <AddMealModal open={addMealModalOpen} onOpenChange={(open) => { setAddMealModalOpen(open); if (!open) setPrefilledHour(null); }} onAddMeal={handleAddMeal} />
      <AddMealModal open={editMealModalOpen} onOpenChange={(open) => { setEditMealModalOpen(open); if (!open) setEditingMeal(null); }} onAddMeal={handleUpdateMeal} editingMeal={editingMeal} isEditMode={true} />
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handlePhotoCapture} />
    </div>
  );
};

export default Meals;