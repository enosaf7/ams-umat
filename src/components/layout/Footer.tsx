
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import DepartmentLogo from "@/components/ui/DepartmentLogo";

const Footer = () => {
  const { siteSettings } = useSettings();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-6">
              <DepartmentLogo isScrolled={false} />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {siteSettings?.site_description ?? 
                "Advancing mathematical excellence through innovative teaching, cutting-edge research, and fostering analytical thinking for tomorrow's leaders."
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-umat-yellow transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-umat-yellow transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-umat-yellow transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-umat-yellow transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-umat-yellow">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/lecturers" className="text-gray-300 hover:text-white transition-colors">
                  Faculty
                </Link>
              </li>
              <li>
                <Link to="/students" className="text-gray-300 hover:text-white transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors">
                  News & Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-umat-yellow">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-umat-green mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>University of Mines and Technology</p>
                  <p>Mathematics Department</p>
                  <p>Tarkwa, Ghana</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-umat-green flex-shrink-0" />
                <span className="text-gray-300">+233 (0) 312 022 400</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-umat-green flex-shrink-0" />
                <span className="text-gray-300">math@umat.edu.gh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} University of Mines and Technology - Mathematics Department. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
