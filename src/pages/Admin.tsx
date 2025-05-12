
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
