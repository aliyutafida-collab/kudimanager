import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { Switch, Route } from "wouter";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { SplashScreen } from "@/components/splash-screen";

// Pages
import Dashboard from "@/pages/dashboard";
import Sales from "@/pages/sales";
import Expenses from "@/pages/expenses";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import Learn from "@/pages/learn";
import Subscription from "@/pages/subscription";
import Subscribe from "@/pages/subscribe";
import Billing from "@/pages/billing";
import TaxCalculator from "@/pages/tax-calculator";
import Vendors from "@/pages/vendors";
import AIAdvisor from "@/pages/ai-advisor";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SetupWizard from "@/pages/setup-wizard";
import NotFound from "@/pages/not-found";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

// Header with theme toggle
function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

// Protected layout with sidebar
function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Switch>
              {/* Public Routes - No sidebar */}
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/setup" component={SetupWizard} />

              {/* Protected Routes - With sidebar */}
              <Route path="/">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/sales">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Sales />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/expenses">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Expenses />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/inventory">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Inventory />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/reports">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Reports />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/learn">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Learn />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/subscription">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Subscription />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/subscribe">
                <ProtectedRoute allowExpired={true}>
                  <ProtectedLayout>
                    <Subscribe />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/billing">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Billing />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/tax-calculator">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <TaxCalculator />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/vendors">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Vendors />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              <Route path="/ai-advisor">
                <ProtectedRoute>
                  <ProtectedLayout>
                    <AIAdvisor />
                  </ProtectedLayout>
                </ProtectedRoute>
              </Route>

              {/* 404 - Catch all unknown routes */}
              <Route path="/:rest*" component={NotFound} />
            </Switch>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
