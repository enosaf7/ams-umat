import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash, Upload } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface StudentLeader {
  id: string;
  full_name: string;
  position: string;
  bio: string | null;
  contact_email: string | null;
  academic_year: string;
  image_url: string | null;
}

const StudentLeadersManagement = () => {
  const [leaders, setLeaders] = useState<StudentLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    bio: '',
    contact_email: '',
    academic_year: '',
    image_url: ''
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setImagePreviewUrl(null);
      return;
    }
    
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    
    try {
      setIsUploading(true);
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, selectedFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      } else if (editingId) {
        // Keep existing image if editing and no new file selected
        const currentLeader = leaders.find(leader => leader.id === editingId);
        imageUrl = currentLeader?.image_url || '';
      }
      
      const leaderData = {
        full_name: formData.full_name,
        position: formData.position,
        bio: formData.bio || null,
        contact_email: formData.contact_email || null,
        academic_year: formData.academic_year,
        image_url: imageUrl || null
      };
      
      if (editingId) {
        // Update existing leader
        const { error } = await supabase
          .from('student_leaders')
          .update(leaderData)
          .eq('id', editingId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Student leader updated successfully"
        });
      } else {
        // Create new leader
        const { error } = await supabase
          .from('student_leaders')
          .insert([leaderData]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Student leader added successfully"
        });
      }
      
      // Reset form and state
      resetForm();
      fetchLeaders();
      
    } catch (error: any) {
      toast({
        title: "Error saving student leader",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      position: '',
      bio: '',
      contact_email: '',
      academic_year: '',
      image_url: ''
    });
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setEditingId(null);
  };

  const editLeader = (leader: StudentLeader) => {
    setFormData({
      full_name: leader.full_name,
      position: leader.position,
      bio: leader.bio || '',
      contact_email: leader.contact_email || '',
      academic_year: leader.academic_year,
      image_url: leader.image_url || ''
    });
    setEditingId(leader.id);
    setImagePreviewUrl(leader.image_url);
  };

  const deleteLeader = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student leader?")) {
      return;
    }
    
    try {
      // First find the leader to get the image URL
      const leader = leaders.find(item => item.id === id);
      const imageUrl = leader?.image_url;
      
      // Delete the leader record
      const { error } = await supabase
        .from('student_leaders')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // If there's an image, extract the file name from the URL and delete it
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('profile_photos')
            .remove([fileName]);
            
          if (storageError) {
            console.error('Error deleting image:', storageError);
          }
        }
      }
      
      toast({
        title: "Success",
        description: "Student leader deleted successfully"
      });
      
      fetchLeaders();
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
          <CardTitle>{editingId ? "Edit Student Leader" : "Add New Student Leader"}</CardTitle>
          <CardDescription>Fill in the details to {editingId ? "update" : "add"} a student leader</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                <Input
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
              <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-24"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-sm font-medium">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year" className="text-sm font-medium">Academic Year</Label>
                <Input
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
              <Label className="text-sm font-medium">Profile Image</Label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('profile-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </Button>
                <Input 
                  id="profile-upload"
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
              
              {imagePreviewUrl && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Image Preview:</p>
                  <div className="relative w-32 h-32 rounded overflow-hidden border">
                    <img 
                      src={imagePreviewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-80"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreviewUrl(null);
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Saving..." : editingId ? "Update Leader" : "Add Leader"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading student leaders...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Student Leaders</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaders.length > 0 ? (
              leaders.map((leader) => (
                <Card key={leader.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{leader.full_name}</CardTitle>
                        <CardDescription>{leader.position}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-blue-600" 
                          onClick={() => editLeader(leader)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600" 
                          onClick={() => deleteLeader(leader.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {leader.image_url && (
                      <div className="w-full h-40">
                        <img 
                          src={leader.image_url} 
                          alt={leader.full_name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-700 mb-3">{leader.bio || 'No biography provided'}</p>
                      <div className="text-xs text-gray-500">
                        {leader.contact_email && <p>Email: {leader.contact_email}</p>}
                        <p>Academic Year: {leader.academic_year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No student leaders found. Add your first student leader using the form above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeadersManagement;
