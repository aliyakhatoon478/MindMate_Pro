import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookHeart, 
  BarChart3, 
  UserCircle, 
  LogOut, 
  BrainCircuit,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

type LayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Journal", icon: BookHeart, href: "/journal" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
];

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('mindmate_current_user');
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "See you tomorrow!",
    });
    setLocation("/");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground p-6 border-r border-sidebar-border">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-xl tracking-tight">MindMate</h1>
          <p className="text-xs text-muted-foreground font-medium">PRO EDITION</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-sidebar-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 fixed h-full z-30">
        <NavContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md z-40 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg">MindMate</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-none">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 pt-20 md:pt-0 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
