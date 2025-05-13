
import { useState } from "react";
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

const SettingsPanel = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // Site settings (in a real app these would be saved to the database)
  const [siteSettings, setSiteSettings] = useState({
    siteName: "UMaT - Department of Mathematical Sciences",
    maintenanceMode: false,
    registrationEnabled: true,
    contactEmail: "mathematics@umat.edu.gh",
    footerText: "© 2025 Department of Mathematical Sciences, UMaT. All rights reserved."
  });
  
  const handleSiteSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleChange = (name: string, checked: boolean) => {
    setSiteSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const saveSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully"
    });
  };
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
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
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={siteSettings.siteName}
                  onChange={handleSiteSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={handleSiteSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  name="footerText"
                  value={siteSettings.footerText}
                  onChange={handleSiteSettingChange}
                  rows={2}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenanceMode" 
                  checked={siteSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleToggleChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label htmlFor="registrationEnabled">Enable User Registration</Label>
                  <p className="text-sm text-gray-500">
                    Allow new users to register on the site
                  </p>
                </div>
                <Switch
                  id="registrationEnabled" 
                  checked={siteSettings.registrationEnabled}
                  onCheckedChange={(checked) => handleToggleChange('registrationEnabled', checked)}
                />
              </div>
              
              <Button onClick={saveSettings} className="mt-4">
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
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-gray-500">
                    Automatically log out inactive users
                  </p>
                </div>
                <select className="border rounded p-1">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>8 hours</option>
                </select>
              </div>
              
              <Button>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
              <CardDescription>Export your site data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-700">
                Create a backup of your site's data. This includes all user profiles, news articles, and student leader information.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Button variant="outline" className="justify-start">
                  Export Users Data (CSV)
                </Button>
                <Button variant="outline" className="justify-start">
                  Export News & Announcements (CSV)
                </Button>
                <Button variant="outline" className="justify-start">
                  Export Student Leaders Data (CSV)
                </Button>
                <Button className="justify-start">
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
