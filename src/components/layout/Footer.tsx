
import { Link } from 'react-router-dom';
import DepartmentLogo from '@/components/ui/DepartmentLogo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <DepartmentLogo size="lg" className="mb-4" />
          <p className="text-lg italic text-umat-yellow">"AMS! - Eureka, AMS!! - I've found it, AMS!!! - The brain behind development"</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-umat-yellow">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-umat-yellow transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-umat-yellow transition-colors">About Us</Link></li>
              <li><Link to="/lecturers" className="hover:text-umat-yellow transition-colors">Lecturers</Link></li>
              <li><Link to="/students" className="hover:text-umat-yellow transition-colors">Students</Link></li>
              <li><Link to="/news" className="hover:text-umat-yellow transition-colors">News & Events</Link></li>
              <li><Link to="/contact" className="hover:text-umat-yellow transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-umat-yellow">Contact Information</h3>
            <address className="not-italic">
              <p>Department of Mathematical Sciences</p>
              <p>University of Mines and Technology</p>
              <p>Tarkwa, Ghana</p>
              <p className="mt-3">Email: math@umat.edu.gh</p>
              <p>Phone: +233 123 456 789</p>
            </address>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-umat-yellow">About the Department</h3>
            <p className="mb-4">The Department of Mathematical Sciences at UMaT is committed to excellence in teaching, research, and service in mathematics and its applications.</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Department of Mathematical Sciences, UMaT. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-umat-yellow">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-umat-yellow">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
