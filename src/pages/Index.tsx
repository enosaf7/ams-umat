
import Hero from "@/components/home/Hero";
import MissionVision from "@/components/home/MissionVision";
import Features from "@/components/home/Features";
import NewsEvents from "@/components/home/NewsEvents";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <MissionVision />
        <Features />
        <NewsEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
