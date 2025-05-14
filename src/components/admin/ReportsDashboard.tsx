
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { subDays, subMonths, subYears, format, startOfMonth, endOfMonth } from 'date-fns';

interface ReportData {
  totalUsers: number;
  totalNews: number;
  totalMaterials: number;
  userRegistrationData: { name: string; students: number; lecturers: number; admins: number }[];
  roleDistributionData: { name: string; value: number }[];
}

const fetchReportData = async (timeRange: 'weekly' | 'monthly' | 'yearly'): Promise<ReportData> => {
  const { toast } = useToast(); // This will not work here, useToast must be called within a React component body.
                               // We should pass toast function or handle errors differently.
                               // For now, console.error will be used for errors in this async function.

  try {
    // Fetch total counts
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    if (usersError) throw usersError;

    const { count: newsCount, error: newsError } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });
    if (newsError) throw newsError;

    const { count: materialsCount, error: materialsError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
    if (materialsError) throw materialsError;

    // Fetch profiles for charts
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('created_at, role');
    if (profilesError) throw profilesError;

    // Process User Registration Data based on timeRange
    let startDate: Date;
    const endDate = new Date();
    if (timeRange === 'weekly') startDate = subDays(endDate, 7);
    else if (timeRange === 'monthly') startDate = subMonths(endDate, 1);
    else startDate = subYears(endDate, 1);
    
    const monthlyUserRegistrations: { [key: string]: { students: number; lecturers: number; admins: number } } = {};

    profilesData?.forEach(profile => {
      const createdAt = new Date(profile.created_at);
      if (createdAt >= startDate && createdAt <= endDate) {
        const monthYear = format(createdAt, 'MMM yyyy');
        if (!monthlyUserRegistrations[monthYear]) {
          monthlyUserRegistrations[monthYear] = { students: 0, lecturers: 0, admins: 0 };
        }
        if (profile.role === 'student') monthlyUserRegistrations[monthYear].students++;
        else if (profile.role === 'lecturer') monthlyUserRegistrations[monthYear].lecturers++;
        else if (profile.role === 'admin') monthlyUserRegistrations[monthYear].admins++;
      }
    });
    
    const userRegistrationData = Object.entries(monthlyUserRegistrations)
      .map(([name, counts]) => ({ name, ...counts }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()); // Ensure chronological order


    // Process Role Distribution
    const roleCounts: { [key: string]: number } = { Students: 0, Lecturers: 0, Admins: 0 };
    profilesData?.forEach(profile => {
      if (profile.role === 'student') roleCounts.Students++;
      else if (profile.role === 'lecturer') roleCounts.Lecturers++;
      else if (profile.role === 'admin') roleCounts.Admins++;
      // Add other roles if necessary, or a default category
    });
    const roleDistributionData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

    return {
      totalUsers: usersCount ?? 0,
      totalNews: newsCount ?? 0,
      totalMaterials: materialsCount ?? 0,
      userRegistrationData,
      roleDistributionData,
    };

  } catch (error: any) {
    console.error("Error fetching report data:", error.message);
    // Can't use toast here directly. The calling component should handle this.
    throw new Error(`Failed to fetch report data: ${error.message}`);
  }
};


const ReportsDashboard = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const { data: reportData, isLoading, error, refetch } = useQuery<ReportData, Error>({
    queryKey: ['reportsData', timeRange],
    queryFn: () => fetchReportData(timeRange),
    // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    refetch();
  }, [timeRange, refetch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Added one more color for admins in bar chart

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green"></div>
          <p className="ml-4">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
        
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'weekly' | 'monthly' | 'yearly')}
          className="border rounded p-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
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
            <p className="text-4xl font-bold">{reportData?.totalUsers ?? 'N/A'}</p>
            {/* <p className="text-sm text-gray-500">Dynamic percentage change TBD</p> */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">News Items</CardTitle>
            <CardDescription>Published content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reportData?.totalNews ?? 'N/A'}</p>
            {/* <p className="text-sm text-gray-500">Dynamic percentage change TBD</p> */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Course Materials</CardTitle>
            <CardDescription>Uploaded resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reportData?.totalMaterials ?? 'N/A'}</p>
            {/* <p className="text-sm text-gray-500">Dynamic percentage change TBD</p> */}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Registration Trends</CardTitle>
            <CardDescription>New users registered over time ({timeRange})</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData?.userRegistrationData ?? []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#4F46E5" name="Students" />
                <Bar dataKey="lecturers" fill="#10B981" name="Lecturers" />
                <Bar dataKey="admins" fill="#FFBB28" name="Admins" />
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
                  data={reportData?.roleDistributionData ?? []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(reportData?.roleDistributionData ?? []).map((entry, index) => (
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
