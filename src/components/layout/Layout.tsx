
import React from "react";
import Navbar from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

// Example: pt-16 (64px) for desktop, pt-14 (56px) for mobile
const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-14 sm:pt-16 px-4">
      {children}
    </main>
  </>
);

export default Layout;
