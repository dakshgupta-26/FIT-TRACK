import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/services/api';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Exercise } from "@/components/workouts/WorkoutCard"; // Import a shared Exercise type if available

// --- Zod Validation Schema for the FORM DATA ---
const exerciseSchema = z.object({
    name: z.string().min(1, 'Exercise name is required.'),
    sets: z.coerce.number().min(1, 'Sets must be at least 1.'),
    reps: z.string().min(1, 'Reps or duration is required.'),
});

const workoutFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long.'),
    duration: z.coerce.number().min(1, 'Duration must be at least 1 minute.'),
    type: z.enum(['Strength', 'Cardio', 'Flexibility']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    estimatedCalories: z.coerce.number().optional(),
    targetMuscles: z.string().optional(), // In the form, this is a comma-separated string
    exercises: z.array(exerciseSchema).min(1, 'You must add at least one exercise.'),
});

// --- Type Definitions ---
// This type is inferred from the Zod schema and represents the FORM's state
type WorkoutFormData = z.infer<typeof workoutFormSchema>;

// This interface represents the final data structure, matching what's in Workouts.tsx
// It does NOT extend WorkoutFormData to avoid type conflicts.
interface Workout {
    id: string;
    _id?: string;
    title: string;
    duration: number;
    type: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    exercises: Exercise[];
    estimatedCalories?: number;
    targetMuscles?: string[];
    popularity?: number;
}

interface CreateWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWorkoutCreated: (newWorkout: Workout) => void;
}

export const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ isOpen, onClose, onWorkoutCreated }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutFormSchema),
        defaultValues: {
            title: '',
            duration: 30,
            type: 'Strength',
            difficulty: 'Medium',
            estimatedCalories: 0,
            targetMuscles: '',
            exercises: [{ name: '', sets: 3, reps: '10' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "exercises"
    });

    const onSubmit = async (data: WorkoutFormData) => {
        setIsSubmitting(true);
        try {
            const transformedData = {
                ...data,
                targetMuscles: data.targetMuscles ? data.targetMuscles.split(',').map(s => s.trim()) : [],
            };

            const response = await api.post<Workout>('/workouts', transformedData);

            toast({
                title: "Success! 🎉",
                description: `Workout "${response.data.title}" has been created.`,
            });

            onWorkoutCreated(response.data);
            form.reset();
            onClose();

        } catch (error) {
            toast({
                title: "Error Creating Workout",
                description: "Something went wrong. Please check your data and try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* FIXED: Added flex layout and max-height to DialogContent for proper scrolling */}
            <DialogContent className="sm:max-w-[650px] flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create a New Workout</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to build your custom workout routine.
                    </DialogDescription>
                </DialogHeader>

                {/* FIXED: Wrapped form in a scrollable div */}
                <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
                    <Form {...form}>
                        {/* The form element is now inside the scrollable area */}
                        <form id="create-workout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Workout Title</FormLabel>
                                        <FormControl><Input placeholder="e.g., Morning Strength Routine" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="duration" render={({ field }) => (
                                    <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select workout type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Strength">Strength</SelectItem><SelectItem value="Cardio">Cardio</SelectItem><SelectItem value="Flexibility">Flexibility</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="difficulty" render={({ field }) => (
                                    <FormItem><FormLabel>Difficulty</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="estimatedCalories" render={({ field }) => (
                                    <FormItem><FormLabel>Est. Calories (optional)</FormLabel><FormControl><Input type="number" placeholder="350" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="targetMuscles" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Target Muscles (optional)</FormLabel><FormControl><Input placeholder="e.g., Chest, Triceps, Core" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="mt-6 col-span-2">
                                <h3 className="text-lg font-semibold mb-2">Exercises</h3>
                                {fields.map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start mb-3 p-3 border rounded-md">
                                        <FormField control={form.control} name={`exercises.${index}.name`} render={({ field }) => (<FormItem className="col-span-12 sm:col-span-5"><FormControl><Input placeholder="Exercise Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`exercises.${index}.sets`} render={({ field }) => (<FormItem className="col-span-6 sm:col-span-3"><FormControl><Input type="number" placeholder="Sets" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`exercises.${index}.reps`} render={({ field }) => (<FormItem className="col-span-6 sm:col-span-3"><FormControl><Input placeholder="Reps (e.g., 12 or 45s)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <div className="col-span-12 sm:col-span-1 flex items-center justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', sets: 3, reps: '10' })}><PlusCircle className="h-4 w-4 mr-2" />Add Exercise</Button>
                                <FormField control={form.control} name="exercises" render={() => (<FormItem><FormMessage className="mt-2" /></FormItem>)} />
                            </div>
                        </form>
                    </Form>
                </div>

                {/* FIXED: Footer is now outside the scrollable area */}
                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    {/* The 'form' attribute links this button to the form inside the scrollable div */}
                    <Button type="submit" form="create-workout-form" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Workout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};