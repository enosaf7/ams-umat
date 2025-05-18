import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-umat-green/90 to-umat-green min-h-[600px] flex items-center">
      {/* Mathematical symbols background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 text-7xl">∫</div>
        <div className="absolute top-1/2 left-3/4 text-8xl">Σ</div>
        <div className="absolute bottom-1/4 left-1/3 text-6xl">∂</div>
        <div className="absolute top-1/3 right-1/4 text-5xl">π</div>
        <div className="absolute bottom-1/3 right-1/3 text-9xl">√</div>
        <div className="absolute bottom-1/2 left-1/2 text-8xl">θ</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Department of Mathematical Sciences
          </h1>
          <h2 className="text-xl md:text-2xl mb-8 text-gray-100 font-light">
            University of Mines and Technology (UMaT), Ghana
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Cultivating excellence in mathematical thinking, research, and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-umat-yellow hover:bg-umat-yellow/90 text-black">
              <Link to="/about">About the Department</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/20">
              <Link to="/students">Student Resources</Link>
            </Button>
          </div>
          <div className="mt-16">
            <p className="text-lg font-semibold text-umat-yellow italic">
              "AMS! - Eureka, AMS!! - I've found it, MATHEMATICS!!! - The brain behind development"
            </p>
            <div className="text-lg font-semibold text-umat-yellow italic flex flex-col items-start">
              <span>AMS! - Eureka,</span>
              <span>AMS!! - I've found it,</span>
              <span>MATHEMATICS!!! - The brain behind development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
