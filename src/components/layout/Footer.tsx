
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

const Footer = () => {
  const { siteSettings } = useSettings();
  return (
    <footer className="w-full py-4 text-center bg-gray-100 border-t">
      {siteSettings?.site_description ?? "University of Mines and Technology Mathematics Department"}
    </footer>
  );
};

export default Footer;
