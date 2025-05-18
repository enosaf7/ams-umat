import React from "react";
import Navbar from "@/components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

/**
 * Adjust NAVBAR_HEIGHT if your navbar is taller/shorter.
 * If using Tailwind, pt-16 = 4rem = 64px.
 */
const NAVBAR_HEIGHT = 64; // in px

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Navbar />
    <main
      // For Tailwind users, you can use: className="min-h-screen pt-16 px-4"
      style={{
        minHeight: "100vh",
        paddingTop: NAVBAR_HEIGHT,
        paddingLeft: "1rem",
        paddingRight: "1rem"
      }}
    >
      {children}
    </main>
  </>
);

export { Layout };
