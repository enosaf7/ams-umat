
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  created_at: string;
};

const NewsEvents = () => {
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        setRecentNews(data || []);
      } catch (error) {
        console.error("Error fetching recent news:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentNews();
  }, []);

  // Format the date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fallback news data in case no news items are available yet
  const fallbackNews = [
    {
      id: "1",
      title: "Mathematics Research Symposium 2025",
      content: "Join us for our annual research symposium featuring guest speakers from top universities around the world.",
      created_at: new Date().toISOString(),
      category: "Event",
      image_url: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: "2",
      title: "Department Receives Research Grant",
      content: "Our department has been awarded a prestigious grant to study mathematical modeling in mineral extraction processes.",
      created_at: new Date().toISOString(),
      category: "Announcement",
      image_url: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: "3",
      title: "New Course: Mathematics for Machine Learning",
      content: "Starting next semester, we'll be offering a new course focused on the mathematics behind machine learning algorithms.",
      created_at: new Date().toISOString(),
      category: "Academic",
      image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    }
  ];

  // Use actual news if available, otherwise use fallback
  const displayNews = recentNews.length > 0 ? recentNews : fallbackNews;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="section-heading">Latest News & Events</h2>
          <Button asChild variant="outline" className="border-umat-green text-umat-green hover:bg-umat-green/10">
            <Link to="/news">View All</Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umat-green mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading latest news...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayNews.map((news) => (
              <div key={news.id} className="math-card overflow-hidden group">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={news.image_url || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-0 right-0 bg-umat-yellow text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
                    {news.category}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{formatDate(news.created_at)}</p>
                <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">{news.title}</h3>
                <p className="text-gray-600 mb-4">
                  {news.content.length > 120 
                    ? `${news.content.substring(0, 120)}...` 
                    : news.content}
                </p>
                <Link to={`/news/${news.id}`} className="text-umat-green font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsEvents;
