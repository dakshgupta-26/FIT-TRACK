import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Clock, Target, TrendingUp } from 'lucide-react';

export interface FilterState {
  difficulties: string[];
  durations: string[];
  types: string[];
  sortBy: string;
}

interface WorkoutFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const difficulties = [
  { value: 'Easy', label: 'Easy', icon: '🌱' },
  { value: 'Medium', label: 'Medium', icon: '💪' },
  { value: 'Hard', label: 'Hard', icon: '🔥' }
];

const durations = [
  { value: 'short', label: '< 30 min', icon: '⚡' },
  { value: 'medium', label: '30-45 min', icon: '⏱️' },
  { value: 'long', label: '> 45 min', icon: '🕐' }
];

const types = [
  { value: 'Strength', label: 'Strength', icon: '🏋️' },
  { value: 'Cardio', label: 'Cardio', icon: '❤️' },
  { value: 'Flexibility', label: 'Flexibility', icon: '🧘' }
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
  { value: 'duration', label: 'Duration', icon: Clock },
  { value: 'difficulty', label: 'Difficulty', icon: Target }
];

export function WorkoutFilters({ filters, onFiltersChange }: WorkoutFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'difficulties' | 'durations' | 'types', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilters(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      difficulties: [],
      durations: [],
      types: [],
      sortBy: 'popular'
    });
  };

  const activeFilterCount = filters.difficulties.length + filters.durations.length + filters.types.length;

  return (
    <div className="flex items-center gap-3">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <div className="space-y-2">
                  {difficulties.map(difficulty => (
                    <div key={difficulty.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${difficulty.value}`}
                        checked={filters.difficulties.includes(difficulty.value)}
                        onCheckedChange={() => toggleArrayFilter('difficulties', difficulty.value)}
                      />
                      <label htmlFor={`difficulty-${difficulty.value}`} className="text-sm flex items-center gap-2">
                        <span>{difficulty.icon}</span>
                        {difficulty.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <div key={duration.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`duration-${duration.value}`}
                        checked={filters.durations.includes(duration.value)}
                        onCheckedChange={() => toggleArrayFilter('durations', duration.value)}
                      />
                      <label htmlFor={`duration-${duration.value}`} className="text-sm flex items-center gap-2">
                        <span>{duration.icon}</span>
                        {duration.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="space-y-2">
                  {types.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.types.includes(type.value)}
                        onCheckedChange={() => toggleArrayFilter('types', type.value)}
                      />
                      <label htmlFor={`type-${type.value}`} className="text-sm flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select value={filters.sortBy} onValueChange={(value) => updateFilters('sortBy', value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1">
          {filters.difficulties.map(difficulty => (
            <Badge key={difficulty} variant="secondary" className="text-xs">
              {difficulty}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('difficulties', difficulty)}
              />
            </Badge>
          ))}
          {filters.types.map(type => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('types', type)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}