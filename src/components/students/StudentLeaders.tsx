
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type StudentLeader = Tables<"student_leaders">;

const StudentLeaders = () => {
  const [leaders, setLeaders] = useState<StudentLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("student_leaders")
          .select("*")
          .order("position");

        if (error) {
          throw error;
        }

        setLeaders(data || []);
      } catch (err: any) {
        console.error("Error fetching student leaders:", err);
        setError(err.message || "Failed to load student leaders");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="container my-8">
        <h2 className="text-3xl font-bold text-center mb-10">Know Your Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-48 mt-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Know Your Leaders</h2>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">Failed to load student leaders: {error}</p>
        </div>
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="container my-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Know Your Leaders</h2>
        <p className="text-gray-500">No student leaders information available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container my-12 px-4 md:px-6">
      <h2 className="text-3xl font-bold text-center mb-10">Know Your Leaders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((leader) => (
          <Card key={leader.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={leader.image_url || ""}
                    alt={leader.full_name} 
                  />
                  <AvatarFallback className="text-2xl bg-umat-green text-white">
                    {leader.full_name.split(" ").map(name => name[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{leader.full_name}</CardTitle>
              <CardDescription className="font-medium text-umat-green">
                {leader.position}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{leader.bio || "No bio available."}</p>
              {leader.contact_email && (
                <p className="text-xs text-gray-500">
                  Contact: <a href={`mailto:${leader.contact_email}`} className="text-umat-yellow hover:underline">
                    {leader.contact_email}
                  </a>
                </p>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Academic Year: {leader.academic_year}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentLeaders;
