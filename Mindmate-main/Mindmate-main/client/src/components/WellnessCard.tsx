import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type WellnessCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
  actionLabel?: string;
  onAction?: () => void;
};

const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
  green: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
};

const ICON_BG_MAP = {
  blue: "bg-blue-200/50",
  green: "bg-green-200/50",
  purple: "bg-purple-200/50",
  orange: "bg-orange-200/50",
};

export function WellnessCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  actionLabel, 
  onAction 
}: WellnessCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-all duration-300",
      COLOR_MAP[color]
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", ICON_BG_MAP[color])}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-lg leading-tight">{title}</h3>
          <p className="text-sm opacity-90 leading-relaxed max-w-[90%]">
            {description}
          </p>
        </div>
      </div>
      
      {actionLabel && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <Button 
            variant="ghost" 
            className="h-auto p-0 font-medium hover:bg-transparent hover:underline"
            onClick={onAction}
          >
            {actionLabel} →
          </Button>
        </div>
      )}
    </div>
  );
}
