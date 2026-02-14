import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <article className="prose prose-lg max-w-none">
            <h1>Blog Post {id}</h1>
            <p className="text-muted-foreground">Published on January 15, 2024</p>
            
            <p>
              This is a placeholder for blog post content. In a real application,
              you would fetch the post data based on the ID and display the full content here.
            </p>
            
            <h2>About Smart Meters</h2>
            <p>
              Smart meters represent the future of energy management, providing real-time
              data and enabling better control over electricity consumption.
            </p>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
