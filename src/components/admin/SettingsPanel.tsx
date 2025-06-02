
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";

type SiteSettingsData = {
  id: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

const SITE_SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const SettingsPanel = () => {
  const { toast } = useToast();
  const { siteSettings: globalSettings, refreshSettings } = useSettings();

  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (globalSettings) {
      setSiteSettings({
        id: globalSettings.id,
        maintenance_mode: globalSettings.maintenance_mode,
        registration_enabled: globalSettings.registration_enabled,
        created_at: globalSettings.created_at,
        updated_at: globalSettings.updated_at,
      });
      setIsLoadingSettings(false);
    } else {
      setIsLoadingSettings(true);
    }
  }, [globalSettings]);

  const handleToggleChange = (name: keyof SiteSettingsData, checked: boolean) => {
    setSiteSettings(prev => (prev ? { ...prev, [name]: checked } : null));
  };

  const saveSettings = async () => {
    if (!siteSettings) {
      toast({ title: "Error", description: "Settings data not loaded.", variant: "destructive" });
      return;
    }
    if (isLoadingSettings) {
      toast({ title: "Please wait", description: "Settings are still loading.", variant: "default" });
      return;
    }
    const payload = {
      maintenance_mode: siteSettings.maintenance_mode,
      registration_enabled: siteSettings.registration_enabled,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", SITE_SETTINGS_ID);

    if (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved", description: "Your settings have been saved successfully." });
      await refreshSettings();
    }
  };

  // Download entire database as CSV (all tables joined into one CSV for simplicity)
  const downloadDatabaseCSV = async () => {
    setIsDownloading(true);
    try {
      // Define table names with proper typing
      const tables = [
        { name: "profiles", table: "profiles" as const },
        { name: "news", table: "news" as const },
        { name: "student_leaders", table: "student_leaders" as const },
        { name: "site_settings", table: "site_settings" as const },
        { name: "contact_messages", table: "contact_messages" as const },
        { name: "courses", table: "courses" as const },
      ];
      
      let csvData = "";

      for (const { name, table } of tables) {
        try {
          const { data, error } = await supabase.from(table).select("*");
          if (error) {
            console.error(`Error fetching ${name}:`, error);
            continue;
          }
          if (data && data.length > 0) {
            // Generate CSV for this table
            const keys = Object.keys(data[0]);
            csvData += `\n\nTable: ${name}\n`;
            csvData += keys.join(",") + "\n";
            data.forEach(row => {
              csvData += keys.map(k => JSON.stringify(row[k] ?? "")).join(",") + "\n";
            });
          }
        } catch (tableError) {
          console.error(`Error processing table ${name}:`, tableError);
          continue;
        }
      }

      // Download as file
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "database_backup.csv";
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Download started", description: "Database CSV download started." });
    } catch (error: any) {
      toast({ title: "Error downloading CSV", description: error.message, variant: "destructive" });
    }
    setIsDownloading(false);
  };

  if (isLoadingSettings || !siteSettings) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green"></div>
        <p className="ml-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>
      <Tabs defaultValue="site">
        <TabsList>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
        </TabsList>
        <TabsContent value="site" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={siteSettings.maintenance_mode ?? false}
                  onCheckedChange={checked => handleToggleChange("maintenance_mode", checked)}
                  disabled={isLoadingSettings}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="registration_enabled">Enable User Registration</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow new users to register on the site
                  </p>
                </div>
                <Switch
                  id="registration_enabled"
                  checked={siteSettings.registration_enabled ?? false}
                  onCheckedChange={checked => handleToggleChange("registration_enabled", checked)}
                  disabled={isLoadingSettings}
                />
              </div>
              <Button onClick={saveSettings} className="mt-4" disabled={isLoadingSettings}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="backup" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Download a CSV backup of all database tables.
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadDatabaseCSV} disabled={isDownloading}>
                {isDownloading ? "Downloading..." : "Download Full Database (CSV)"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
