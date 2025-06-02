
import Hero from "@/components/home/Hero";
import MissionVision from "@/components/home/MissionVision";
import Features from "@/components/home/Features";
import NewsEvents from "@/components/home/NewsEvents";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <MissionVision />
      <Features />
      <NewsEvents />
    </Layout>
  );
};

export default Index;
