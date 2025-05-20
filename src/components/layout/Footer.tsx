import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

const Footer = () => {
  const { siteSettings } = useSettings();
  return (
    <footer className="w-full py-4 text-center bg-gray-100 border-t">
      {siteSettings?.footer_text ?? "Default Footer"}
    </footer>
  );
};

export default Footer;
