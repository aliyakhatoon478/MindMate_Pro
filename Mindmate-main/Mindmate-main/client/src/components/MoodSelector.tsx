import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mood } from "@/lib/api";

type MoodSelectorProps = {
  value?: Mood;
  onChange: (mood: Mood) => void;
  disabled?: boolean;
};

const MOODS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'GREAT', label: 'Great', emoji: '🤩', color: 'bg-green-100 border-green-200 text-green-700' },
  { value: 'GOOD', label: 'Good', emoji: '🙂', color: 'bg-blue-100 border-blue-200 text-blue-700' },
  { value: 'OKAY', label: 'Okay', emoji: '😐', color: 'bg-gray-100 border-gray-200 text-gray-700' },
  { value: 'BAD', label: 'Bad', emoji: '😔', color: 'bg-orange-100 border-orange-200 text-orange-700' },
  { value: 'TERRIBLE', label: 'Terrible', emoji: '😫', color: 'bg-red-100 border-red-200 text-red-700' },
];

export function MoodSelector({ value, onChange, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full">
      {MOODS.map((mood) => {
        const isSelected = value === mood.value;
        
        return (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            disabled={disabled}
            className={cn(
              "group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 border-2",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected 
                ? cn("border-primary/50 shadow-lg scale-105", mood.color) 
                : "bg-card border-transparent hover:border-border hover:bg-accent/50 grayscale-[0.8] hover:grayscale-0",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            type="button"
          >
            <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-200">
              {mood.emoji}
            </span>
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity",
              isSelected && "opacity-100"
            )}>
              {mood.label}
            </span>
            
            {isSelected && (
              <motion.div
                layoutId="mood-indicator"
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
