
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  contact_email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface SettingsContextType {
  siteSettings: SiteSettings | null;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
        // Create default settings if they don't exist
        const defaultSettings: SiteSettings = {
          id: '00000000-0000-0000-0000-000000000001',
          site_title: 'UMAT Mathematics Department',
          site_description: 'University of Mines and Technology Mathematics Department',
          maintenance_mode: false,
          registration_enabled: true,
          contact_email: 'math@umat.edu.gh',
          phone: '+233-XXX-XXX-XXX',
          address: 'University of Mines and Technology, Tarkwa, Ghana',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSiteSettings(defaultSettings);
      } else {
        setSiteSettings(data as SiteSettings);
      }
    } catch (error) {
      console.error('Unexpected error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    siteSettings,
    refreshSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
