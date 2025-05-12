
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-umat-green/90 py-20 px-4">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-6">About the Department</h1>
            <p className="text-xl max-w-3xl">
              The Department of Mathematical Sciences at the University of Mines and Technology (UMaT)
              is committed to excellence in teaching, research, and service in mathematics and its applications.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="section-heading mb-8">Our History</h2>
              <p className="text-gray-700 mb-6">
                The Department of Mathematical Sciences at the University of Mines and Technology was established in 1988 
                with the mission to provide strong mathematical foundations for engineering students and to develop 
                mathematical practitioners who can address complex problems in mining, technology, and other industries.
              </p>
              <p className="text-gray-700 mb-6">
                Over the decades, we have grown from a small department supporting engineering programs to a 
                comprehensive academic unit offering specialized courses in pure and applied mathematics, statistics, 
                and computational mathematics.
              </p>
              <p className="text-gray-700 mb-6">
                Today, our department stands as a center of excellence in mathematical education and research, 
                particularly in areas related to mathematical modeling of mining operations, environmental mathematics, 
                computational fluid dynamics, and data science for resource management.
              </p>
              
              <h2 className="section-heading mt-14 mb-8">Message from the Head of Department</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mr-6 mb-4 sm:mb-0 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Head of Department" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Prof. Kwame Nyantakyi</h3>
                  <p className="text-umat-green">Head of Department</p>
                </div>
              </div>
              <blockquote className="border-l-4 border-umat-yellow pl-4 italic mb-6">
                "Mathematics is the language of the universe, and at the Department of Mathematical Sciences, 
                we aim to equip our students with the fluency to read, interpret, and contribute to this universal language. 
                Our commitment to excellence in teaching and research prepares our students not just for careers, 
                but for a lifetime of analytical thinking and problem-solving."
              </blockquote>
              <p className="text-gray-700">
                I invite you to explore our department, engage with our faculty, and discover the 
                exciting opportunities that await in the field of mathematical sciences at UMaT.
              </p>
            </div>
            
            <div className="lg:col-span-1">
              <div className="math-card mb-8">
                <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>Founded in 1988</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>15 Full-time Faculty Members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>Over 200 Undergraduate Students</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>30+ Graduate Students</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>5 Research Groups</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-umat-green font-bold mr-2">✓</span>
                    <span>20+ International Collaborations</span>
                  </li>
                </ul>
              </div>
              
              <div className="math-card">
                <h3 className="text-xl font-bold mb-4">Our Motto</h3>
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p className="text-umat-green font-bold mb-1">"AMS! - Eureka"</p>
                  <p className="text-umat-green font-bold mb-1">"AMS!! - I've found it"</p>
                  <p className="text-umat-green font-bold">"AMS!!! - The brain behind development"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
