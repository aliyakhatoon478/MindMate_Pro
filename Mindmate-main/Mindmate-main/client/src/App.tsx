import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import { ProtectedRoute } from "@/lib/protected-route";
import { Layout } from "@/components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute component={() => (
            <Layout>
              <Dashboard />
            </Layout>
          )} />
        )}
      </Route>
      
      <Route path="/journal">
        {() => (
          <ProtectedRoute component={() => (
            <Layout>
              <Journal />
            </Layout>
          )} />
        )}
      </Route>
      
      <Route path="/analytics">
        {() => (
          <ProtectedRoute component={() => (
            <Layout>
              <Analytics />
            </Layout>
          )} />
        )}
      </Route>

      <Route path="/profile">
        {() => (
          <ProtectedRoute component={() => (
            <Layout>
              <Profile />
            </Layout>
          )} />
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
