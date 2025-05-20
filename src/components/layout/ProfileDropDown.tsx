import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProfileDropdown = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/profile")}
        className="focus:outline-none"
        aria-label="Profile"
      >
        <img
          src={profile?.avatar_url || "/default-avatar.png"}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border"
        />
      </button>
      <div className="mt-2">
        <span>{profile?.first_name || "User"}</span>
      </div>
    </div>
  );
};

export default ProfileDropdown;
