import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Heart, Plus, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  serving: string;
  nutrition: NutritionData;
  category: string;
  nutritionScore: number; // 1-5 stars
  isFavorite?: boolean;
}

interface EnhancedFoodDatabaseProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  className?: string;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CATEGORIES = ['Protein', 'Grains', 'Vegetables', 'Fruits', 'Dairy', 'Fats'];

export function EnhancedFoodDatabase({ 
  foods, 
  onAddFood, 
  onToggleFavorite,
  className 
}: EnhancedFoodDatabaseProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'calories' | 'protein' | 'nutritionScore'>('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock food suggestions based on search
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return foods
      .filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5)
      .map(food => food.name);
  }, [searchTerm, foods]);

  const filteredFoods = useMemo(() => {
    const filtered = foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(food.category);
      const matchesFavorites = !showFavoritesOnly || food.isFavorite;
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });

    // Sort foods
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'calories':
          return b.nutrition.calories - a.nutrition.calories;
        case 'protein':
          return b.nutrition.protein - a.nutrition.protein;
        case 'nutritionScore':
          return b.nutritionScore - a.nutritionScore;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [foods, searchTerm, selectedCategories, showFavoritesOnly, sortBy]);

  const handleBatchAdd = () => {
    const selectedFoodItems = foods.filter(food => selectedFoods.includes(food.id));
    selectedFoodItems.forEach(food => onAddFood(food));
    setSelectedFoods([]);
    
    toast({
      title: `Added ${selectedFoodItems.length} foods`,
      description: "Selected foods have been added to your daily log",
      duration: 3000,
    });
  };

  const getNutritionScore = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-3 w-3", 
          i < score ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        )} 
      />
    ));
  };

  const getMacroColor = (macro: 'protein' | 'carbs' | 'fat') => {
    switch (macro) {
      case 'protein': return 'bg-green-500';
      case 'carbs': return 'bg-amber-500';
      case 'fat': return 'bg-orange-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search foods..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && searchTerm.length >= 2 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                  onClick={() => setSearchTerm(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Food Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CATEGORIES.map(category => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('calories')}>
                Calories (High-Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('protein')}>
                Protein (High-Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('nutritionScore')}>
                Nutrition Score
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedFoods.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedFoods.length} foods selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedFoods([])}>
              Clear
            </Button>
            <Button size="sm" onClick={handleBatchAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add Selected
            </Button>
          </div>
        </div>
      )}

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map(food => (
          <Card key={food.id} className="food-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold leading-tight">
                    {food.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {food.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getNutritionScore(food.nutritionScore)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox
                    checked={selectedFoods.includes(food.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFoods([...selectedFoods, food.id]);
                      } else {
                        setSelectedFoods(selectedFoods.filter(id => id !== food.id));
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(food.id)}
                  >
                    <Heart className={cn(
                      "h-4 w-4",
                      food.isFavorite && "fill-red-500 text-red-500"
                    )} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Serving:</span>
                  <span className="font-medium">{food.serving}</span>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {food.nutrition.calories}
                  </div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span>🥩</span>
                      <span>Protein</span>
                    </div>
                    <div className="font-medium">{food.nutrition.protein}g</div>
                    <Progress 
                      value={(food.nutrition.protein / food.nutrition.calories) * 400} 
                      className="h-1 mt-1" 
                      indicatorClassName={getMacroColor('protein')}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span>🍞</span>
                      <span>Carbs</span>
                    </div>
                    <div className="font-medium">{food.nutrition.carbs}g</div>
                    <Progress 
                      value={(food.nutrition.carbs / food.nutrition.calories) * 400} 
                      className="h-1 mt-1" 
                      indicatorClassName={getMacroColor('carbs')}
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span>🥑</span>
                      <span>Fat</span>
                    </div>
                    <div className="font-medium">{food.nutrition.fat}g</div>
                    <Progress 
                      value={(food.nutrition.fat / food.nutrition.calories) * 400} 
                      className="h-1 mt-1" 
                      indicatorClassName={getMacroColor('fat')}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddFood(food)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Log
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No foods found matching your criteria.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

export default EnhancedFoodDatabase;