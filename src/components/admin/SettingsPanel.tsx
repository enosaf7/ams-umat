import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type SiteSettingsData = {
  id: string;
  site_name: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  contact_email: string;
  footer_text: string;
  enable_2fa: boolean;
  session_timeout_minutes: number;
  created_at?: string;
  updated_at?: string;
};

type SettingsContextType = {
  siteSettings: SiteSettingsData | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
};

const SITE_SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", SITE_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      setSiteSettings({
        id: SITE_SETTINGS_ID,
        site_name: "Default Site Name",
        maintenance_mode: false,
        registration_enabled: true,
        contact_email: "default@example.com",
        footer_text: "© Default Footer",
        enable_2fa: false,
        session_timeout_minutes: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else if (data) {
      setSiteSettings(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        siteSettings,
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
