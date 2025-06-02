
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Students from "@/pages/Students";
import Lecturers from "@/pages/Lecturers";
import Contact from "@/pages/Contact";
import News from "@/pages/News";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import Chat from "@/pages/Chat";
import Profile from "@/pages/profile";
import StudentPayment from "@/pages/StudentPayment";
import NotFound from "@/pages/NotFound";
import MaintenancePage from "@/pages/MaintenancePage";
import { useSettings } from "@/contexts/SettingsContext";

const MainRouter = () => {
  const { siteSettings, isLoading } = useSettings();

  // Show loading state while settings are being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green"></div>
      </div>
    );
  }

  // Show maintenance page if maintenance mode is enabled
  if (siteSettings?.maintenance_mode) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/students" element={<Students />} />
      <Route path="/lecturers" element={<Lecturers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/news" element={<News />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/payment" element={<StudentPayment />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRouter;
