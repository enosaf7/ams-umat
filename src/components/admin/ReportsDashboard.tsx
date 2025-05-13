
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsDashboard = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  // Sample data - in a real app this would come from the database
  const userData = [
    { name: 'Jan', students: 40, lecturers: 8 },
    { name: 'Feb', students: 45, lecturers: 9 },
    { name: 'Mar', students: 60, lecturers: 10 },
    { name: 'Apr', students: 90, lecturers: 12 },
    { name: 'May', students: 100, lecturers: 14 },
    { name: 'Jun', students: 110, lecturers: 15 },
  ];
  
  const roleDistribution = [
    { name: 'Students', value: 420 },
    { name: 'Lecturers', value: 48 },
    { name: 'Admins', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
        
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'weekly' | 'monthly' | 'yearly')}
          className="border rounded p-1 text-sm"
        >
          <option value="weekly">Last 7 days</option>
          <option value="monthly">Last 30 days</option>
          <option value="yearly">Last 12 months</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
            <CardDescription>Current registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">473</p>
            <p className="text-sm text-green-600">↑ 12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">News Items</CardTitle>
            <CardDescription>Published content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">24</p>
            <p className="text-sm text-green-600">↑ 8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Course Materials</CardTitle>
            <CardDescription>Uploaded resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">156</p>
            <p className="text-sm text-green-600">↑ 15% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Registration Trends</CardTitle>
            <CardDescription>New users over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#4F46E5" name="Students" />
                <Bar dataKey="lecturers" fill="#10B981" name="Lecturers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Distribution</CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Engagement Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">User Activity</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
              <TabsTrigger value="views">Page Views</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="py-4">
              <p className="text-gray-500">
                User activity data will be displayed here. This feature is in development.
              </p>
            </TabsContent>
            <TabsContent value="downloads" className="py-4">
              <p className="text-gray-500">
                Download statistics will be displayed here. This feature is in development.
              </p>
            </TabsContent>
            <TabsContent value="views" className="py-4">
              <p className="text-gray-500">
                Page view analytics will be displayed here. This feature is in development.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsDashboard;
