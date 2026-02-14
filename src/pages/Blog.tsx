import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const posts = [
    {
      id: "1",
      title: "Understanding Prepaid Energy Meters",
      excerpt: "Learn how prepaid energy meters work and their benefits for modern households.",
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "IoT in Energy Management",
      excerpt: "Discover how Internet of Things technology is revolutionizing energy consumption monitoring.",
      date: "2024-01-10",
    },
    {
      id: "3",
      title: "Smart Home Energy Tips",
      excerpt: "Practical tips to reduce your electricity consumption and save money.",
      date: "2024-01-05",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-4">Blog</h1>
          <p className="text-center text-muted-foreground mb-12">
            Insights and updates about smart energy management
          </p>
          
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{post.title}</h2>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="link" className="p-0">
                    Read more →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
