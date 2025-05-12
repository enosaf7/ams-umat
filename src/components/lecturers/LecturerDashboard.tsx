
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, User, Settings, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LecturerDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLecturer, setIsLecturer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLecturerStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is a lecturer or admin
      if (profile?.role === 'lecturer' || profile?.role === 'admin') {
        setIsLecturer(true);
      } else {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setLoading(false);
      fetchMaterials();
    };

    checkLecturerStatus();
  }, [user, profile, navigate, toast]);

  const fetchMaterials = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('lecturer_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching materials",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !selectedCourse || !user) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course_materials')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('course_materials')
        .getPublicUrl(filePath);

      // Save course info to database
      const courseData = {
        title,
        description,
        lecturer_id: user.id,
        file_path: filePath,
        file_name: selectedFile.name,
        file_type: materialType
      };
      
      const { error: dbError } = await supabase
        .from('courses')
        .insert([courseData]);
        
      if (dbError) throw dbError;
      
      toast({
        title: "Upload successful",
        description: "Your material has been uploaded successfully.",
      });
      
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      
      // Refresh materials list
      fetchMaterials();
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (id: string, filePath: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('course_materials')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Update UI
      setMaterials(materials.filter(material => material.id !== id));
      
      toast({
        title: "Material deleted",
        description: "Your material has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLecturer) {
    return null; // Will be redirected by the useEffect
  }

  const getLecturerName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.username || 'Lecturer';
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {getLecturerName()}! Manage your course materials and student information</p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>Upload lecture notes, slides, and other course materials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Course</label>
                    <select 
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      required
                    >
                      <option value="">Select a course</option>
                      <option value="Mathematical Analysis">Mathematical Analysis</option>
                      <option value="Linear Algebra">Linear Algebra</option>
                      <option value="Calculus I">Calculus I</option>
                      <option value="Differential Equations">Differential Equations</option>
                      <option value="Numerical Methods">Numerical Methods</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Material Type</label>
                    <select 
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Lecture Slides">Lecture Slides</option>
                      <option value="Study Notes">Study Notes</option>
                      <option value="Practice Problems">Practice Problems</option>
                      <option value="Exam Review">Exam Review</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input 
                    placeholder="Enter material title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                    placeholder="Enter a brief description of the material"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your file here, or click to browse</p>
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Select File
                    </Button>
                  </label>
                  {selectedFile && (
                    <div className="mt-4 text-sm">
                      <p>Selected: {selectedFile.name}</p>
                      <Button 
                        onClick={handleUpload} 
                        className="mt-2 bg-umat-green hover:bg-umat-green/90"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload File"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Display uploaded materials */}
                {materials.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Your Uploaded Materials</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {materials.map((material) => (
                            <tr key={material.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{material.title}</div>
                                <div className="text-sm text-gray-500">{material.file_name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.file_type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(material.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => deleteMaterial(material.id, material.file_path)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Manage student assignments and grades.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage student information.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Customize your dashboard preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This feature will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LecturerDashboard;
