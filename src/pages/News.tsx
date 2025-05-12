
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const News = () => {
  // Sample data - in a real app, this would come from an API or CMS
  const newsItems = [
    {
      id: 1,
      title: "Mathematics Research Symposium 2025",
      content: "Join us for our annual research symposium featuring guest speakers from top universities around the world.",
      date: "March 15, 2025",
      category: "Event",
      image: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 2,
      title: "Department Receives Research Grant",
      content: "Our department has been awarded a prestigious grant to study mathematical modeling in mineral extraction processes.",
      date: "February 28, 2025",
      category: "Announcement",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 3,
      title: "New Course: Mathematics for Machine Learning",
      content: "Starting next semester, we'll be offering a new course focused on the mathematics behind machine learning algorithms.",
      date: "February 10, 2025",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 4,
      title: "International Mathematics Competition Success",
      content: "Our students won top prizes at the International Mathematics Competition held in South Africa.",
      date: "January 20, 2025",
      category: "Achievement",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 5,
      title: "Faculty Publication in Nature Mathematics",
      content: "Dr. Akosua Asamoah's research on computational methods for mining optimization has been published in Nature Mathematics.",
      date: "January 5, 2025",
      category: "Research",
      image: "https://images.unsplash.com/photo-1516383607781-913a19294fd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 6,
      title: "Mathematics Department Open House",
      content: "Prospective students are invited to tour our facilities and meet faculty members during our upcoming open house.",
      date: "December 10, 2024",
      category: "Event",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    }
  ];

  const events = newsItems.filter(item => item.category === "Event");
  const announcements = newsItems.filter(item => item.category === "Announcement" || item.category === "Academic");
  const achievements = newsItems.filter(item => item.category === "Achievement" || item.category === "Research");

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
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {newsItems.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {events.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="announcements">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {announcements.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {achievements.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-umat-green text-umat-green hover:bg-umat-green/10">
              Load More News
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// News Card Component
interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  image: string;
}

const NewsCard = ({ item }: { item: NewsItem }) => {
  return (
    <div className="math-card overflow-hidden group h-full flex flex-col">
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-umat-yellow text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
          {item.category}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-2">{item.date}</p>
      <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">{item.title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{item.content}</p>
      <Button variant="link" className="text-umat-green p-0 justify-start hover:text-umat-green/80">
        Read More
      </Button>
    </div>
  );
};

export default News;
