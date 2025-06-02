
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DepartmentLogo from "@/components/ui/DepartmentLogo";
import { MessageSquare, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Lecturers", path: "/lecturers" },
    { name: "Students", path: "/students" },
    { name: "News", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

  if (profile?.role === 'admin') {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'User';
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    return "U";
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-2"
          : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <DepartmentLogo isScrolled={isScrolled} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? isScrolled
                      ? "bg-umat-green/10 text-umat-green"
                      : "bg-white/20 text-white"
                    : isScrolled
                    ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/chat">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />
                        ) : (
                          <AvatarFallback className="bg-umat-green text-white text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth" className="ml-4">
                <Button 
                  variant={isScrolled ? "default" : "outline"} 
                  size="sm"
                  className={isScrolled ? "bg-umat-green hover:bg-umat-green/90" : "border-white text-white hover:bg-white hover:text-black"}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled ? "text-gray-900" : "text-white"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-umat-green/10 text-umat-green"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-8 w-8 mr-3">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={getUserDisplayName()} />
                    ) : (
                      <AvatarFallback className="bg-umat-green text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                    <div className="text-xs text-gray-500">@{profile?.username}</div>
                  </div>
                </div>
                <Link
                  to="/chat"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/auth"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-umat-green text-white hover:bg-umat-green/90"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
