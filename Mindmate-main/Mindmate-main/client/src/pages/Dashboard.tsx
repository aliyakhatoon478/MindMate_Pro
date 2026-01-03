import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Mood } from "@/lib/api";
import { format } from "date-fns";
import { 
  Sun, 
  Moon, 
  Coffee, 
  Zap,
  TrendingUp,
  Award,
  CalendarCheck,
  Book,
  Music
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodChart } from "@/components/MoodChart";
import { WellnessCard } from "@/components/WellnessCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: api.auth.me });
  const { data: todayEntry, isLoading: isLoadingToday } = useQuery({ queryKey: ['today'], queryFn: api.moods.getToday });
  const { data: history } = useQuery({ queryKey: ['history'], queryFn: api.moods.getHistory });
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: api.analytics.getWeeklyStats });
  const { data: recommendations } = useQuery({ queryKey: ['recommendations'], queryFn: api.analytics.getRecommendations });

  // Mutation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMood) throw new Error("Please select a mood");
      return api.moods.checkIn(selectedMood, note, ['Daily Check-in']);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast({
        title: "Check-in complete!",
        description: "Your mood has been logged for today.",
      });
      setNote("");
    }
  });

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    await checkInMutation.mutateAsync();
    setIsSubmitting(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {getGreeting()}, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Let's take a moment to reflect on your day.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-secondary px-4 py-2 rounded-full text-secondary-foreground">
          <CalendarCheck className="w-4 h-4" />
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Check-in Card */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Daily Check-in
              </CardTitle>
              <CardDescription>How are you feeling right now?</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingToday ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ) : todayEntry ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="text-5xl animate-bounce-slow">
                     {todayEntry.mood === 'GREAT' ? '🤩' : 
                      todayEntry.mood === 'GOOD' ? '🙂' : 
                      todayEntry.mood === 'OKAY' ? '😐' : 
                      todayEntry.mood === 'BAD' ? '😔' : '😫'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Check-in Complete!</h3>
                    <p className="text-green-600">You're feeling {todayEntry.mood.toLowerCase()} today.</p>
                  </div>
                  <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "Editing past entries will be available in the next update."})}>
                    Edit Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <MoodSelector value={selectedMood} onChange={setSelectedMood} disabled={isSubmitting} />
                  
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: selectedMood ? 1 : 0, height: selectedMood ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Add a note (optional)</label>
                      <Textarea 
                        placeholder="What's on your mind?..." 
                        className="resize-none bg-white/50 focus:bg-white transition-colors"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button 
                      className="w-full h-11 text-base shadow-lg shadow-primary/20" 
                      onClick={handleSubmit} 
                      disabled={!selectedMood || isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Check-in"}
                    </Button>
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts */}
          {history && history.length > 0 && (
            <MoodChart data={history} className="shadow-sm border-border/50" />
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Streak Card */}
          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-heading">{stats?.streak || 0}</span>
                <span className="text-xl opacity-80">days</span>
              </div>
              <p className="text-sm mt-2 opacity-80">You're on fire! Keep it up.</p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Recommended for You
            </h3>
            
            {recommendations?.map((rec) => {
              const IconMap = { Coffee, Moon, Sun, Zap, Book, Music };
              return (
                <WellnessCard 
                  key={rec.id}
                  title={rec.title}
                  description={rec.description}
                  icon={IconMap[rec.icon]}
                  color={rec.color}
                  actionLabel="Learn More"
                  onAction={() => toast({ title: rec.title, description: "Opening recommendation details..." })}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
