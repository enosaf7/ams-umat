
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import StudentLeaders from "./StudentLeaders";
import { WalletCards } from "lucide-react";

const StudentPortal = () => {
  const { user } = useAuth();
  
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Student Resources</h1>
      
      {/* Payment button at the top */}
      <div className="mb-8 flex justify-center">
        <Button asChild className="bg-umat-green hover:bg-umat-green/90 flex items-center gap-2">
          <Link to="/student-payment">
            <WalletCards className="h-5 w-5" />
            Make a Payment
          </Link>
        </Button>
      </div>
      
      {!user ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Access Student Resources</h2>
          <p className="mb-6 text-gray-600">
            Please login to access all student resources including course materials, timetables, and announcements.
          </p>
          <Button asChild className="bg-umat-green hover:bg-umat-green/90">
            <Link to="/auth">Login or Sign Up</Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Lecture Notes" 
                description="Access lecture notes for all courses"
                iconClass="i-lucide-book-open"
              />
              <ResourceCard 
                title="Past Questions" 
                description="Review past examination questions"
                iconClass="i-lucide-file-question"
              />
              <ResourceCard 
                title="Course Outlines" 
                description="View course outlines for the semester"
                iconClass="i-lucide-list"
              />
              <ResourceCard 
                title="Research Papers" 
                description="Access published papers by faculty"
                iconClass="i-lucide-newspaper"
              />
              <ResourceCard 
                title="Tutorials" 
                description="Access tutorial materials and schedules"
                iconClass="i-lucide-check-circle"
              />
              <ResourceCard 
                title="Library Resources" 
                description="Access digital library resources"
                iconClass="i-lucide-library"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle>Class Timetable</CardTitle>
                <CardDescription>Current semester schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-gray-500">
                  Timetable will be available soon. Please check back later.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Important Announcements</CardTitle>
                <CardDescription>Stay updated with the latest department news</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Upcoming Examinations</h3>
                    <p className="text-sm text-gray-600">Mid-semester examinations start next week. Please check your student portal for the schedule.</p>
                    <p className="text-xs text-gray-400 mt-1">Posted: May 5, 2025</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">Department Meeting</h3>
                    <p className="text-sm text-gray-600">All students are invited to a department meeting on Friday at 2 PM in Lecture Hall A.</p>
                    <p className="text-xs text-gray-400 mt-1">Posted: May 3, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Student Leaders Section - Always visible regardless of login status */}
      <StudentLeaders />
    </div>
  );
};

const ResourceCard = ({ title, description, iconClass }: { title: string; description: string; iconClass: string }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-umat-green hover:bg-umat-green/90">Access</Button>
      </CardContent>
    </Card>
  );
};

export default StudentPortal;
