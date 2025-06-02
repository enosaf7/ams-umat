
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-14">
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
