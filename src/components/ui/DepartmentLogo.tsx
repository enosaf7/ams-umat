
import { Link } from "react-router-dom";

interface DepartmentLogoProps {
  isScrolled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DepartmentLogo = ({ 
  isScrolled = false, 
  className = "", 
  size = "md" 
}: DepartmentLogoProps) => {
  // Size classes for different logo sizes
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };

  return (
    <Link
      to="/"
      className={`flex items-center gap-2 font-bold transition-all ${className}`}
    >
      <div className={`${isScrolled ? "bg-umat-yellow" : "bg-umat-yellow"} text-black px-2 py-1 rounded flex items-center justify-center ${sizeClasses[size]}`}>
        <span className="text-xl font-bold">AMS</span>
      </div>
      <span className={`${isScrolled ? "text-black" : "text-white"} font-bold transition-colors`}>
        UMaT
      </span>
    </Link>
  );
};

export default DepartmentLogo;
