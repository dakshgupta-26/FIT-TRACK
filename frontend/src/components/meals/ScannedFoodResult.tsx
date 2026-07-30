// frontend/src/components/meals/ScannedFoodResult.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NutritionData } from '@/types/nutrition'; // Assuming this type exists

// Define the shape of the data we expect from our new AI endpoint
export interface ScannedData {
    summary: string;
    items: Array<{
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }>;
}

interface ScannedFoodResultProps {
    data: ScannedData;
    onAddMeal: (mealData: { name: string; nutrition: NutritionData }) => void;
    onClear: () => void;
}

export const ScannedFoodResult: React.FC<ScannedFoodResultProps> = ({ data, onAddMeal, onClear }) => {

    const handleAddAsMeal = () => {
        // Combine all scanned items into a single meal
        const totalNutrition: NutritionData = data.items.reduce((acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const mealName = data.items.map(item => item.name).join(', ');

        onAddMeal({
            name: `Scanned Meal: ${mealName.substring(0, 50)}`, // Truncate long names
            nutrition: totalNutrition,
        });
    };

    return (
        <Card className="mt-8 border-primary border-2 animate-fade-in">
            <CardHeader>
                <CardTitle className="text-xl">Food Scan Analysis</CardTitle>
                <CardDescription>{data.summary}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Food Item</TableHead>
                            <TableHead className="text-right">Calories</TableHead>
                            <TableHead className="text-right">Protein (g)</TableHead>
                            <TableHead className="text-right">Carbs (g)</TableHead>
                            <TableHead className="text-right">Fat (g)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium capitalize">{item.name}</TableCell>
                                <TableCell className="text-right">{item.calories}</TableCell>
                                <TableCell className="text-right">{item.protein}</TableCell>
                                <TableCell className="text-right">{item.carbs}</TableCell>
                                <TableCell className="text-right">{item.fat}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClear}>Clear</Button>
                <Button onClick={handleAddAsMeal}>Add as Meal</Button>
            </CardFooter>
        </Card>
    );
};