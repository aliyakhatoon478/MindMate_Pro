import { useLocation } from "wouter";
import { useEffect } from "react";
import { api } from "@/lib/api";

type ProtectedRouteProps = {
  component: React.ComponentType<any>;
  [key: string]: any;
};

// Simple mock auth check
// In a real app, this would use a context provider
export function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const isAuthenticated = !!localStorage.getItem('mindmate_current_user');

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <Component {...rest} />;
}
