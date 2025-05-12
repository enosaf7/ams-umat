
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LecturerDashboard from "@/components/lecturers/LecturerDashboard";

const Lecturers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <LecturerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Lecturers;
