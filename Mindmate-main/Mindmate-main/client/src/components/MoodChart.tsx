import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoodEntry } from "@/lib/api";
import { format, parseISO } from 'date-fns';

type MoodChartProps = {
  data: MoodEntry[];
  title?: string;
  className?: string;
};

const MOOD_VALUES = {
  'GREAT': 5,
  'GOOD': 4,
  'OKAY': 3,
  'BAD': 2,
  'TERRIBLE': 1
};

export function MoodChart({ data, title = "Mood Trends", className }: MoodChartProps) {
  // Process data for chart
  // Sort by date ascending for the chart
  const sortedData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      ...entry,
      value: MOOD_VALUES[entry.mood],
      dateShort: format(parseISO(entry.date), 'MMM d')
    }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Your emotional journey over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateShort" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
                minTickGap={30}
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => {
                   if(value === 5) return '🤩';
                   if(value === 3) return '😐';
                   if(value === 1) return '😫';
                   return '';
                }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid hsl(var(--border))',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))'
                }}
                labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => {
                  const label = Object.keys(MOOD_VALUES).find(key => MOOD_VALUES[key as keyof typeof MOOD_VALUES] === value);
                  return [label, 'Mood'];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMood)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
