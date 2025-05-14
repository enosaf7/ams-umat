import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; 
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";
import { useSettings } from "@/contexts/SettingsContext"; // Import useSettings

// Define the specific type for site settings row for clarity
type SiteSettingsData = Tables<'site_settings'>;

// The fixed ID for the single row of site settings
const SITE_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const SettingsPanel = () => {
  const { toast } = useToast();
  const { refreshSettings } = useSettings(); // Consume refreshSettings from context
  
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  
  // Password change form state (remains unchanged)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchLocalSiteSettings = async () => { // Renamed to avoid conflict if context also had fetchSiteSettings
      setIsLoadingSettings(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SITE_SETTINGS_ID)
        .maybeSingle();

      if (error) {
        toast({ title: "Error fetching site settings", description: error.message, variant: "destructive" });
        // Initialize with default structure if fetch fails, so UI doesn't break
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
        toast({ title: "No site settings found", description: "Using default settings. Save to create initial settings.", variant: "default" });
        setSiteSettings({
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
      }
      setIsLoadingSettings(false);
    };
    fetchLocalSiteSettings();
  }, [toast]);
  
  const handleSiteSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For numeric inputs that should be numbers in state, parse them
    if (name === "session_timeout_minutes") {
      setSiteSettings(prev => prev ? ({ ...prev, [name]: parseInt(value, 10) }) : null);
    } else {
      setSiteSettings(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };
  
  const handleToggleChange = (name: keyof SiteSettingsData, checked: boolean) => {
    setSiteSettings(prev => prev ? ({ ...prev, [name]: checked }) : null);
  };
  
  const saveAllSiteSettings = async () => {
    if (!siteSettings) {
      toast({ title: "Error", description: "Settings data not loaded or invalid.", variant: "destructive" });
      return;
    }
    if (isLoadingSettings) {
      toast({ title: "Please wait", description: "Settings are still loading.", variant: "default" });
      return;
    }

    const { id, created_at, ...updateData } = siteSettings;

    const numericTimeout = Number(updateData.session_timeout_minutes);
    if (isNaN(numericTimeout) || numericTimeout < 0) {
        toast({ title: "Invalid Input", description: "Session timeout must be a non-negative number.", variant: "destructive" });
        return;
    }
    
    const payload: Omit<SiteSettingsData, 'id' | 'created_at'> = {
      ...updateData,
      session_timeout_minutes: numericTimeout, // Ensure it's a number
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', siteSettings.id);

    if (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved", description: "Your settings have been saved successfully." });
      await refreshSettings(); // Refresh global settings after successful save
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    // supabase.auth.updateUser does not require currentPassword for password change.
    // If you intend to verify currentPassword, it needs custom logic BEFORE calling updateUser.
    // For simplicity, this example directly updates to newPassword if user is authenticated.
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoadingSettings || !siteSettings) { // Added !siteSettings for safety
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Settings</h2>
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green"></div>
          <p className="ml-4">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>
      
      <Tabs defaultValue="site">
        <TabsList>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="site" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  name="site_name"
                  value={siteSettings.site_name ?? ''}
                  onChange={handleSiteSettingChange}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={siteSettings.contact_email ?? ''}
                  onChange={handleSiteSettingChange}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text</Label>
                <Textarea
                  id="footer_text"
                  name="footer_text"
                  value={siteSettings.footer_text ?? ''}
                  onChange={handleSiteSettingChange}
                  rows={2}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance_mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenance_mode" 
                  checked={siteSettings.maintenance_mode ?? false}
                  onCheckedChange={(checked) => handleToggleChange('maintenance_mode', checked)}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="registration_enabled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Enable User Registration</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow new users to register on the site
                  </p>
                </div>
                <Switch
                  id="registration_enabled" 
                  checked={siteSettings.registration_enabled ?? false}
                  onCheckedChange={(checked) => handleToggleChange('registration_enabled', checked)}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <Button onClick={saveAllSiteSettings} className="mt-4" disabled={isLoadingSettings}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled // Current password check not implemented with Supabase default updateUser
                    placeholder="Not required for this operation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <Button type="submit">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Options</CardTitle>
              <CardDescription>Manage additional security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="enable_2fa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable/Disable 2FA (Feature status shown)
                  </p>
                </div>
                <Switch
                  id="enable_2fa"
                  checked={siteSettings.enable_2fa ?? false}
                  onCheckedChange={(checked) => handleToggleChange('enable_2fa', checked)}
                  disabled={isLoadingSettings}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
                <div className="space-y-0.5">
                  <Label htmlFor="session_timeout_minutes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Session Timeout (minutes)</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically log out inactive users
                  </p>
                </div>
                <select 
                  id="session_timeout_minutes"
                  name="session_timeout_minutes"
                  value={siteSettings.session_timeout_minutes ?? 30}
                  onChange={handleSiteSettingChange}
                  className="border rounded p-2 text-sm bg-input text-foreground focus:ring-ring focus:border-ring w-full sm:w-auto"
                  disabled={isLoadingSettings}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              
              <Button onClick={saveAllSiteSettings} disabled={isLoadingSettings}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
              <CardDescription>Export your site data (Placeholder)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Create a backup of your site's data. This section is a placeholder for future backup functionality.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Button variant="outline" className="justify-start" disabled>
                  Export Users Data (CSV)
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  Export News & Announcements (CSV)
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  Export Student Leaders Data (CSV)
                </Button>
                <Button className="justify-start" disabled>
                  Full Database Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
