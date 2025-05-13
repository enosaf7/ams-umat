
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserManagement from "./UserManagement";
import NewsManagement from "./NewsManagement";
import StudentLeadersManagement from "./StudentLeadersManagement";
import ReportsDashboard from "./ReportsDashboard";
import SettingsPanel from "./SettingsPanel";

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        return;
      }

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green mx-auto"></div>
        <p className="text-center mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="news">News & Announcements</TabsTrigger>
          <TabsTrigger value="student-leaders">Student Leaders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="news">
          <NewsManagement />
        </TabsContent>
        
        <TabsContent value="student-leaders">
          <StudentLeadersManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsDashboard />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
