
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, FileText, CircleHelp } from 'lucide-react';

const StudentPortal = () => {
  // Sample data - in a real app, this would come from an API
  const courses = [
    { id: 1, code: "MATH 152", name: "Calculus I", lecturer: "Dr. Kofi Mensah", materials: 12 },
    { id: 2, code: "MATH 164", name: "Linear Algebra", lecturer: "Prof. Akosua Asamoah", materials: 8 },
    { id: 3, code: "MATH 253", name: "Differential Equations", lecturer: "Dr. Emmanuel Danso", materials: 15 },
    { id: 4, code: "MATH 281", name: "Mathematical Statistics", lecturer: "Dr. Sarah Owusu", materials: 10 }
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Portal</h1>
        <p className="text-gray-600 mt-2">Access course materials, assignments, and important information</p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="materials" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Timetable
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center">
            <CircleHelp className="mr-2 h-4 w-4" />
            Help
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>Access lecture notes, slides, and other resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-md hover:border-umat-yellow transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{course.code}: {course.name}</h3>
                        <p className="text-sm text-gray-600">Lecturer: {course.lecturer}</p>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-umat-green">{course.materials}</span>
                        <span className="text-xs text-gray-500">Materials</span>
                      </div>
                    </div>
                    <button className="mt-3 text-umat-green font-medium flex items-center hover:underline">
                      View Materials
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timetable">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
              <CardDescription>View your class schedule and important dates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-md">
                <p className="text-gray-500 text-center">Timetable will be available here in the next phase.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>View and submit your course assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-md">
                <p className="text-gray-500 text-center">Assignments feature will be available in the next phase.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get assistance with portal features and academic support.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Contact Academic Advisors</h3>
                  <p className="text-gray-600 mb-4">Need guidance on your academic journey? Our advisors are here to help.</p>
                  <p className="text-sm font-medium">Email: advisors@math.umat.edu.gh</p>
                  <p className="text-sm font-medium">Phone: +233 123 456 789</p>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
                  <p className="text-gray-600 mb-4">Experiencing issues with the student portal? Our technical team can help.</p>
                  <p className="text-sm font-medium">Email: support@math.umat.edu.gh</p>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Student Success Center</h3>
                  <p className="text-gray-600 mb-4">Get tutoring, study groups, and additional learning resources.</p>
                  <p className="text-sm font-medium">Location: Mathematics Building, Room 201</p>
                  <p className="text-sm font-medium">Hours: Monday-Friday, 9am-5pm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentPortal;
