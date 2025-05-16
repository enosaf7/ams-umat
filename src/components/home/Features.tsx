
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="py-16 bg-gray-50 matrix-bg">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-center mx-auto">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Link to="/lecturers" className="group">
            <div className="math-card h-full group-hover:border-umat-yellow flex flex-col">
              <div className="rounded-xl bg-gradient-to-r from-umat-yellow to-umat-green h-40 mb-6 flex items-center justify-center text-white overflow-hidden">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">Lecturer's Portal</h3>
              <p className="text-gray-600 mb-4 flex-grow">Access tools for uploading lecture materials, managing assignments, and tracking student progress.</p>
              <span className="text-umat-green font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </Link>
          
          <Link to="/students" className="group">
            <div className="math-card h-full group-hover:border-umat-yellow flex flex-col">
              <div className="rounded-xl bg-gradient-to-r from-umat-green to-umat-yellow h-40 mb-6 flex items-center justify-center text-white overflow-hidden">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">Student Resources</h3>
              <p className="text-gray-600 mb-4 flex-grow">Download lecture materials, check schedules, and access important academic resources.</p>
              <span className="text-umat-green font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </Link>
          
          <Link to="/news" className="group">
            <div className="math-card h-full group-hover:border-umat-yellow flex flex-col">
              <div className="rounded-xl bg-gradient-to-r from-umat-yellow/80 to-umat-green/80 h-40 mb-6 flex items-center justify-center text-white overflow-hidden">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">News & Events</h3>
              <p className="text-gray-600 mb-4 flex-grow">Stay updated with the latest department announcements, seminars, and academic events.</p>
              <span className="text-umat-green font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
