
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

type SiteSettingsData = Tables<'site_settings'>;
const SITE_SETTINGS_ID = '00000000-0000-0000-0000-000000000001'; // Fixed ID for site settings row

interface SettingsContextType {
  siteSettings: SiteSettingsData | null;
  isLoadingSettings: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { toast } = useToast();

  const fetchSiteSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', SITE_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      toast({ title: "Error fetching site configuration", description: error.message, variant: "destructive" });
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
    } else {
      setSiteSettings({ // Default values if no settings row found (should be rare)
        id: SITE_SETTINGS_ID,
        site_name: "UMaT Maths Dept - Default",
        maintenance_mode: false,
        registration_enabled: true,
        contact_email: "maths@umat.edu.gh",
        footer_text: "© UMaT Maths",
        enable_2fa: false,
        session_timeout_minutes: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      toast({ title: "Site configuration not found", description: "Default configuration loaded. Admin should save settings.", variant: "default" });
    }
    setIsLoadingSettings(false);
  }, [toast]); // toast is stable

  useEffect(() => {
    fetchSiteSettings();
  }, [fetchSiteSettings]);

  return (
    <SettingsContext.Provider value={{ siteSettings, isLoadingSettings, refreshSettings: fetchSiteSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
