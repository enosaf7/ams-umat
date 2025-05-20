import React from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import MainRouter from "./MainRouter"; // or your main component

function App() {
  return (
    <SettingsProvider>
      <MainRouter />
    </SettingsProvider>
  );
}

export default App;
