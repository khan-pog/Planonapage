"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerInputProps {
  value?: string | null; // YYYY-MM-DD
  onChange?: (dateString: string | null) => void;
}

export function DatePickerInput({ value, onChange }: DatePickerInputProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );

  useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) setSelected(newDate);
    } else {
      setSelected(undefined);
    }
  }, [value]);

  const handleSelect = (date?: Date) => {
    setSelected(date);
    if (onChange) {
      onChange(date ? date.toISOString().split("T")[0] : null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
} 