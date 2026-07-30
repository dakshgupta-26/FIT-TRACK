// src/components/meals/DateNavigator.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // ... (handler functions are the same)

  return (
    // CHANGED: Replaced bg-gray-800 with bg-muted for theme awareness
    <div className="flex items-center justify-center gap-4 p-2 bg-muted rounded-lg mb-6">
      <Button variant="ghost" size="icon" onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          {/* CHANGED: Replaced variant="outline" with a more theme-friendly style */}
          <Button
            variant={"ghost"}
            className={cn(
              "w-[280px] justify-start text-left font-normal text-foreground",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "EEEE, MMMM d") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => { if (date) onDateChange(date); setIsCalendarOpen(false); }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} disabled={isToday(selectedDate)}>
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};