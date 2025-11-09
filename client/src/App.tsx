import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Sales from "@/pages/sales";
import Expenses from "@/pages/expenses";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import TaxCalculator from "@/pages/tax-calculator";
import AIAdvisor from "@/pages/ai-advisor";
import Vendors from "@/pages/vendors";
import Learn from "@/pages/learn";
import Subscription from "@/pages/subscription";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SetupWizard from "@/pages/setup-wizard";
import NotFound from "@/pages/not-found";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  
  return null;
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route>{() => <Redirect to="/login" />}</Route>
    </Switch>
  );
}

function ProtectedRouter() {
  return (
    <ProtectedRoute>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/setup-wizard" component={SetupWizard} />
        <Route path="/sales" component={Sales} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/reports" component={Reports} />
        <Route path="/tax-calculator" component={TaxCalculator} />
        <Route path="/ai-advisor" component={AIAdvisor} />
        <Route path="/vendors" component={Vendors} />
        <Route path="/learn" component={Learn} />
        <Route path="/subscription" component={Subscription} />
        <Route component={NotFound} />
      </Switch>
    </ProtectedRoute>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span className="font-medium" data-testid="text-username">{user.name}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        data-testid="button-logout"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();
  const isAuthPage = location === '/login' || location === '/register';
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isAuthPage || !user) {
    return (
      <main className="flex-1">
        <PublicRouter />
      </main>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <UserProfile />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <ProtectedRouter />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
