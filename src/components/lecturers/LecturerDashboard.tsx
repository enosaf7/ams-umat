
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, User, Settings, BookOpen } from 'lucide-react';

const LecturerDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Here you would typically handle the file upload to a server
    alert(`File "${selectedFile?.name}" would be uploaded in a real application.`);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your course materials and student information</p>
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
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option>Mathematical Analysis</option>
                      <option>Linear Algebra</option>
                      <option>Calculus I</option>
                      <option>Differential Equations</option>
                      <option>Numerical Methods</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Material Type</label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option>Lecture Slides</option>
                      <option>Study Notes</option>
                      <option>Practice Problems</option>
                      <option>Exam Review</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input placeholder="Enter material title" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                    placeholder="Enter a brief description of the material"
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
                      <Button onClick={handleUpload} className="mt-2 bg-umat-green hover:bg-umat-green/90">
                        Upload File
                      </Button>
                    </div>
                  )}
                </div>
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
