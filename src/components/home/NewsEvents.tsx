
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewsEvents = () => {
  // Sample news data (in a real app, this would come from an API or CMS)
  const recentNews = [
    {
      id: 1,
      title: "Mathematics Research Symposium 2025",
      excerpt: "Join us for our annual research symposium featuring guest speakers from top universities around the world.",
      date: "March 15, 2025",
      category: "Event",
      image: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 2,
      title: "Department Receives Research Grant",
      excerpt: "Our department has been awarded a prestigious grant to study mathematical modeling in mineral extraction processes.",
      date: "February 28, 2025",
      category: "Announcement",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 3,
      title: "New Course: Mathematics for Machine Learning",
      excerpt: "Starting next semester, we'll be offering a new course focused on the mathematics behind machine learning algorithms.",
      date: "February 10, 2025",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="section-heading">Latest News & Events</h2>
          <Button asChild variant="outline" className="border-umat-green text-umat-green hover:bg-umat-green/10">
            <Link to="/news">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentNews.map((news) => (
            <div key={news.id} className="math-card overflow-hidden group">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 bg-umat-yellow text-black px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  {news.category}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">{news.date}</p>
              <h3 className="text-xl font-bold mb-3 group-hover:text-umat-green">{news.title}</h3>
              <p className="text-gray-600 mb-4">{news.excerpt}</p>
              <Link to={`/news/${news.id}`} className="text-umat-green font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;
