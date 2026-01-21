import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, ArrowRight, BookOpen, Zap, Sparkles, TrendingUp, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-red-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Electric Particles */}
        <div className="absolute top-40 left-10 w-3 h-3 bg-red-500 rounded-full animate-charge-up opacity-40"></div>
        <div className="absolute top-60 right-32 w-2 h-2 bg-orange-500 rounded-full animate-charge-up opacity-40" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-charge-up opacity-40" style={{ animationDelay: '1.4s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Electric Badge */}
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-full mb-8 shadow-sm hover:shadow-electric-glow transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 animate-energy-flow"></div>
              <div className="relative w-8 h-8 border-2 border-red-500/40 rounded-full animate-meter-spin">
                <BookOpen className="w-4 h-4 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-electric-spark" />
              </div>
              <span className="text-red-600 font-black text-sm relative z-10">⚡ ENERGY INSIGHTS & KNOWLEDGE ⚡</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black text-red-900 mb-6 animate-slide-up-fade">
              <span className="text-gradient-electric-glow animate-gradient-shift">Electric</span> Blog
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-red-700 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              🔥 Discover the latest insights, tips, and innovations in smart energy management across Rwanda
            </p>
            
            {/* Search & Filter Bar */}
            <div className="max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex gap-4 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200/50 shadow-electric-glow">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <Input 
                    placeholder="Search articles..."
                    className="pl-12 border-0 bg-transparent focus:ring-0 text-red-900 placeholder:text-red-500/60"
                  />
                </div>
                <Button className="gradient-electric text-white hover:opacity-90 shadow-electric-glow hover:scale-105 transition-all duration-300 px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative group cursor-pointer" onClick={() => navigate(`/blog/${blogPosts[0].id}`)}>
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-electric-glow transition-all duration-700 hover:scale-[1.02] transform-gpu">
              {/* Electric Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
              <div className="absolute inset-[3px] rounded-3xl bg-white"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-l-3xl h-80 lg:h-auto">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:to-black/40 transition-all duration-500"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="px-6 py-3 bg-red-500 rounded-full shadow-electric-glow animate-electric-pulse">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white animate-electric-spark" />
                        <span className="text-white font-black text-sm">FEATURED</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-red-500 text-white font-bold px-4 py-2">
                      {blogPosts[0].category}
                    </Badge>
                    <div className="flex items-center gap-2 text-red-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {new Date(blogPosts[0].date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-red-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {blogPosts[0].title}
                  </h2>
                  
                  <p className="text-red-700 text-lg leading-relaxed mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-electric rounded-full flex items-center justify-center shadow-electric-glow">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-red-900 font-bold">{blogPosts[0].author}</p>
                        <p className="text-red-600 text-sm">{blogPosts[0].readTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-red-500 group-hover:text-red-600 transition-colors duration-300 group-hover:translate-x-2 transform">
                      <span className="text-lg font-black">Read Article</span>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-red-900">All Articles</h2>
            <div className="flex items-center gap-2 text-red-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">{blogPosts.length} Articles</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <div
                key={post.id}
                className="group cursor-pointer animate-fade-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-electric-glow transition-all duration-500 hover:scale-105 transform-gpu">
                  {/* Electric Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
                  <div className="absolute inset-[2px] rounded-2xl bg-white"></div>
                  
                  <div className="relative z-10">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-2xl h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500/90 text-white font-bold backdrop-blur-sm">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 text-sm font-medium">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-red-400">•</span>
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 text-sm font-medium">{post.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg font-black text-red-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-red-700 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-electric rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-red-600 text-sm font-medium">{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-red-500 group-hover:text-red-600 transition-colors duration-300 group-hover:translate-x-1 transform">
                          <span className="text-sm font-bold">Read</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;