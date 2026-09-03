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
    <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-4 p-1.5 sm:p-2 bg-muted rounded-xl mb-6 w-full max-w-md mx-auto">
      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex-1 max-w-[220px] sm:max-w-[280px] justify-center sm:justify-start text-center sm:text-left font-normal text-foreground text-xs sm:text-sm px-2 sm:px-4",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="truncate">{selectedDate ? format(selectedDate, "EEE, MMM d, yyyy") : "Pick a date"}</span>
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