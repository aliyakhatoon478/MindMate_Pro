import { useQuery } from "@tanstack/react-query";
import { api, MoodEntry } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { Search, Filter, Calendar as CalendarIcon, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function Journal() {
  const { data: entries, isLoading } = useQuery({ queryKey: ['history'], queryFn: api.moods.getHistory });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries?.filter(entry => 
    entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'GREAT': return '🤩';
      case 'GOOD': return '🙂';
      case 'OKAY': return '😐';
      case 'BAD': return '😔';
      case 'TERRIBLE': return '😫';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'GREAT': return 'text-green-600 bg-green-50 border-green-200';
      case 'GOOD': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'OKAY': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'BAD': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'TERRIBLE': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Journal</h1>
          <p className="text-muted-foreground mt-1">Reflect on your past entries and patterns.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
               placeholder="Search entries..." 
               className="pl-9 bg-white"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Button variant="outline" size="icon">
             <Filter className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
             <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))
        ) : filteredEntries && filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow duration-200 border-border/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${getMoodColor(entry.mood)}`}>
                    {getMoodEmoji(entry.mood)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg capitalize">{entry.mood.toLowerCase()} Day</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(parseISO(entry.date), "MMMM do, yyyy")}
                        </span>
                      </div>
                    </div>
                    
                    {entry.note && (
                      <p className="text-foreground/80 leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                    
                    {entry.tags.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {entry.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="font-normal text-xs px-2 py-0.5 h-6">
                            <Tag className="w-3 h-3 mr-1 opacity-50" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>No journal entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
