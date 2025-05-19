import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false); // Close menu when route changes
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 relative">
        {/* Home Button for AMS */}
        <Link to="/" className="group flex items-center space-x-2 select-none">
          <span
            className="
              bg-umat-yellow
              text-umat-green
              font-extrabold
              text-xl
              px-5 py-2
              rounded-full
              shadow
              transition
              duration-150
              ease-in-out
              cursor-pointer
              border-2 border-umat-yellow
              hover:border-umat-green
              hover:bg-yellow-300
              hover:shadow-lg
              group-hover:scale-105
              focus:outline-none
              focus:ring-2 focus:ring-umat-green
              flex items-center
            "
            title="Go to Home"
            tabIndex={0}
            role="button"
            aria-label="Go to Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline mr-2 mb-1"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{ verticalAlign: "middle" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            AMS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`nav-link${location.pathname === "/" ? " font-bold text-umat-green" : ""}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-link${location.pathname.startsWith("/about") ? " font-bold text-umat-green" : ""}`}>
            About
          </Link>
          <Link to="/news" className={`nav-link${location.pathname.startsWith("/news") ? " font-bold text-umat-green" : ""}`}>
            News
          </Link>
          <Link to="/contact" className={`nav-link${location.pathname.startsWith("/contact") ? " font-bold text-umat-green" : ""}`}>
            Contact
          </Link>
          {user && profile?.role === "admin" && (
            <Link to="/admin" className={`nav-link${location.pathname.startsWith("/admin") ? " font-bold text-umat-green" : ""}`}>
              Admin
            </Link>
          )}
          {user ? (
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          ) : (
            <Link to="/auth" className="nav-link">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-umat-green"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-start py-4 px-6 space-y-4 md:hidden z-50">
            <Link to="/" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/news" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
              News
            </Link>
            <Link to="/contact" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            {user && profile?.role === "admin" && (
              <Link to="/admin" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            {user ? (
              <Link to="/profile" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
            ) : (
              <Link to="/auth" className="nav-link w-full" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
