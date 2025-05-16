
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext"; 

import Index from "./pages/Index";
import About from "./pages/About";
import Lecturers from "./pages/Lecturers";
import Students from "./pages/Students";
import StudentPayment from "./pages/StudentPayment"; 
import News from "./pages/News";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat"; // Import the new Chat component
import MaintenancePage from "./pages/MaintenancePage"; 

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { siteSettings, isLoadingSettings } = useSettings();
  const location = useLocation();

  if (isLoadingSettings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Loading configuration...</p>
      </div>
    );
  }

  const GUEST_ACCESSIBLE_PATHS_DURING_MAINTENANCE = ['/admin', '/auth'];
  const isGuestAccessibleDuringMaintenance = GUEST_ACCESSIBLE_PATHS_DURING_MAINTENANCE.some(path => location.pathname.startsWith(path));

  if (siteSettings?.maintenance_mode && !isGuestAccessibleDuringMaintenance) {
    return (
        <Routes>
            <Route path="/admin/*" element={<Admin />} /> 
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/lecturers" element={<Lecturers />} />
      <Route path="/students" element={<Students />} />
      <Route path="/student-payment" element={<StudentPayment />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/chat" element={<Chat />} /> {/* Add the Chat route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
