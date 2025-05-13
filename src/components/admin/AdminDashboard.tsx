import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// User management component
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, [toast]);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">User Management</h2>
      
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="border p-2">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : 'No name provided'}
                  </td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.role || 'student'}</td>
                  <td className="border p-2">
                    <select 
                      value={user.role || 'student'} 
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Student Leaders management
const StudentLeadersManagement = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    bio: '',
    contact_email: '',
    academic_year: '',
    image_url: ''
  });

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const { data, error } = await supabase
          .from('student_leaders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setLeaders(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching student leaders",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaders();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('student_leaders')
        .insert([formData]);

      if (error) throw error;
      
      // Reset form and refresh data
      setFormData({
        full_name: '',
        position: '',
        bio: '',
        contact_email: '',
        academic_year: '',
        image_url: ''
      });
      
      // Refresh the leaders list
      const { data, error: fetchError } = await supabase
        .from('student_leaders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setLeaders(data || []);
      
      toast({
        title: "Success",
        description: "Student leader added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error adding student leader",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteLeader = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_leaders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update the UI
      setLeaders(leaders.filter(leader => leader.id !== id));
      
      toast({
        title: "Success",
        description: "Student leader deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting student leader",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Student Leaders Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Student Leader</CardTitle>
          <CardDescription>Fill in the details to add a new student leader</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
                <input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">Position</label>
                <input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">Biography</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-24"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contact_email" className="text-sm font-medium">Contact Email</label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="academic_year" className="text-sm font-medium">Academic Year</label>
                <input
                  id="academic_year"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image_url" className="text-sm font-medium">Image URL</label>
              <input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-umat-green text-white rounded hover:bg-umat-green/90"
              >
                Add Student Leader
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {loading ? (
        <p>Loading student leaders...</p>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Student Leaders</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaders.map((leader) => (
              <Card key={leader.id}>
                <CardHeader>
                  <CardTitle>{leader.full_name}</CardTitle>
                  <CardDescription>{leader.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  {leader.image_url && (
                    <img 
                      src={leader.image_url} 
                      alt={leader.full_name} 
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                  )}
                  <p className="text-sm">{leader.bio || 'No biography provided'}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Email: {leader.contact_email || 'Not provided'}</p>
                    <p>Academic Year: {leader.academic_year}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => deleteLeader(leader.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Use the profile from context instead of querying again
      if (profile?.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminStatus();
  }, [user, profile, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="student-leaders">Student Leaders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="student-leaders">
          <StudentLeadersManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Reports</h2>
            <p>This feature will be implemented in the next phase.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Settings</h2>
            <p>This feature will be implemented in the next phase.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
