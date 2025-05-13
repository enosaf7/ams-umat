import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash, Image, Upload, Eye } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  is_published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
};

type NewsFormData = {
  title: string;
  content: string;
  category: string;
  is_published: boolean;
};

const NewsManagement = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NewsFormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "announcement",
      is_published: true
    }
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching news",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
        .from('news_images')
        .upload(filePath, selectedFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('news_images')
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

  const onSubmit = async (formData: NewsFormData) => {
    if (!user) return;
    
    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage();
        if (!imageUrl && editingId) {
          // If upload failed during edit, keep existing image
          const currentItem = news.find(item => item.id === editingId);
          imageUrl = currentItem?.image_url || null;
        }
      } else if (editingId) {
        // Keep existing image if editing and no new file selected
        const currentItem = news.find(item => item.id === editingId);
        imageUrl = currentItem?.image_url || null;
      }
      
      const newsData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        is_published: formData.is_published,
        image_url: imageUrl,
        author_id: user.id
      };
      
      if (editingId) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "News item updated successfully"
        });
      } else {
        // Create new news item
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "News item created successfully"
        });
      }
      
      // Reset form and state
      reset();
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setEditingId(null);
      fetchNews();
      
    } catch (error: any) {
      toast({
        title: "Error saving news",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const editNews = (newsItem: NewsItem) => {
    setValue("title", newsItem.title);
    setValue("content", newsItem.content);
    setValue("category", newsItem.category);
    setValue("is_published", newsItem.is_published);
    setEditingId(newsItem.id);
    setImagePreviewUrl(newsItem.image_url);
  };

  const cancelEdit = () => {
    reset();
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setEditingId(null);
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) {
      return;
    }
    
    try {
      // First find the news item to get the image URL
      const newsItem = news.find(item => item.id === id);
      const imageUrl = newsItem?.image_url;
      
      // Delete the news item
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // If there's an image, extract the file name from the URL and delete it
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('news_images')
            .remove([fileName]);
            
          if (storageError) {
            console.error('Error deleting image:', storageError);
          }
        }
      }
      
      toast({
        title: "Success",
        description: "News item deleted successfully"
      });
      
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error deleting news",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Tabs defaultValue="create">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="create">
            {editingId ? "Edit News" : "Create News"}
          </TabsTrigger>
          <TabsTrigger value="manage">Manage News</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit News Item" : "Add New News Item"}</CardTitle>
              <CardDescription>
                Fill in the details to {editingId ? "update" : "create"} a news item or announcement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    {...register("title", { required: "Title is required" })} 
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    className="w-full p-2 border rounded"
                    {...register("category")}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="research">Research</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content"
                    rows={6}
                    {...register("content", { required: "Content is required" })} 
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </Button>
                    <Input 
                      id="image-upload"
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
                      <div className="relative w-full max-w-md h-48 rounded overflow-hidden border">
                        <img 
                          src={imagePreviewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-80"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreviewUrl(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    className="h-4 w-4"
                    {...register("is_published")}
                  />
                  <Label htmlFor="is_published">Publish Immediately</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : editingId ? "Update News" : "Create News"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <h2 className="text-xl font-bold mb-4">Manage News</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading news items...</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.length > 0 ? (
                    news.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.title}</div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span 
                            className={`inline-block px-2 py-1 rounded-md text-xs font-medium
                              ${item.is_published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'}
                            `}
                          >
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => editNews(item)}
                              className="text-blue-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteNews(item.id)}
                              className="text-red-600"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              asChild
                              className="text-gray-600"
                            >
                              <a href={`/news/${item.id}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No news items found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsManagement;
