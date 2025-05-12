
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StudentPortal from "@/components/students/StudentPortal";

const Students = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <StudentPortal />
      </main>
      <Footer />
    </div>
  );
};

export default Students;
