
import { Calculator, BookOpen, Users, Search } from 'lucide-react';
import MathIcon from "../ui/MathIcon";

const MissionVision = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-heading">Our Vision & Mission</h2>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <MathIcon symbol="&Psi;" className="mr-3 h-10 w-10" />
                Vision
              </h3>
              <p className="text-gray-700 ml-14">
                To be a globally recognized center of excellence in mathematical education, 
                research, and application, addressing real-world challenges in mining, technology, 
                and beyond.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <MathIcon symbol="&Phi;" className="mr-3 h-10 w-10" />
                Mission
              </h3>
              <p className="text-gray-700 ml-14">
                To provide quality education in mathematical sciences, conduct innovative research, 
                and nurture analytical minds capable of solving complex problems in industry, 
                academia, and society.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="math-card">
              <Calculator className="w-10 h-10 text-umat-green mb-4" />
              <h3 className="font-bold text-lg mb-2">Academic Excellence</h3>
              <p className="text-gray-600">Delivering top-tier mathematics education for future leaders</p>
            </div>
            
            <div className="math-card">
              <BookOpen className="w-10 h-10 text-umat-green mb-4" />
              <h3 className="font-bold text-lg mb-2">Impactful Research</h3>
              <p className="text-gray-600">Conducting research that addresses critical challenges</p>
            </div>
            
            <div className="math-card">
              <Search className="w-10 h-10 text-umat-green mb-4" />
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-gray-600">Applying mathematics to develop innovative solutions</p>
            </div>
            
            <div className="math-card">
              <Users className="w-10 h-10 text-umat-green mb-4" />
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-gray-600">Fostering a collaborative mathematical community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
