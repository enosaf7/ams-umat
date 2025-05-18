import React from "react";
import Navbar from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen pt-16 px-4">
      {children}
    </main>
  </>
);

export { Layout };
