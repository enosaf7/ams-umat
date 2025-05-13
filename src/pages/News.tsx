
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
};

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setNewsItems(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading news",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [toast]);

  // Filter news items by category
  const events = newsItems.filter(item => item.category === "event");
  const announcements = newsItems.filter(item => item.category === "announcement" || item.category === "academic");
  const achievements = newsItems.filter(item => item.category === "achievement" || item.category === "research");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-umat-green/90 py-20 px-4">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-6">News & Events</h1>
            <p className="text-xl max-w-3xl">
              Stay updated with the latest announcements, events, and achievements from the Department of Mathematical Sciences.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto py-16 px-4">
          <Tabs defaultValue="all" className="w-full mb-10">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-umat-green mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading news items...</p>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {newsItems.length > 0 ? (
                      newsItems.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        No news items found.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="events">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {events.length > 0 ? (
                      events.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        No events found.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="announcements">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {announcements.length > 0 ? (
                      announcements.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        No announcements found.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {achievements.length > 0 ? (
                      achievements.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        No achievements found.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </>
            )}
            
            {newsItems.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="border-umat-green text-umat-green hover:bg-umat-green/10">
                  Load More News
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// News Card Component
interface NewsItemProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsItemProps) => {
  // Format the date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="math-card overflow-hidden group h-full flex flex-col">
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={item.image_url || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-umat-yellow text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">{formatDate(item.created_at)}</p>
      <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">{item.title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">
        {item.content.length > 150 
          ? `${item.content.substring(0, 150)}...` 
          : item.content}
      </p>
      <Button variant="link" className="text-umat-green p-0 justify-start hover:text-umat-green/80">
        Read More
      </Button>
    </div>
  );
};

export default News;
