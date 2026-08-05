import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import IntakePage from "./pages/IntakePage";
import LocalePage from "./pages/LocalePage";
import ReviewAdminPage from "./pages/ReviewAdminPage";
import NotFound from "./pages/NotFound";
import ReviewSummaryPage from "./pages/ReviewSummaryPage";
import ReviewWizardPage from "./pages/ReviewWizardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/nl" replace />} />
          <Route path="/intake" element={<IntakePage />} />
          <Route path="/review-admin" element={<ReviewAdminPage />} />
          <Route path="/review/:token" element={<ReviewWizardPage />} />
          <Route path="/review/:token/summary" element={<ReviewSummaryPage />} />
          <Route path="/:locale/*" element={<LocalePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
