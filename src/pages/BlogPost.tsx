import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen, Zap, Eye, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.id === parseInt(id || '0'));
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-red-900">
        <Navbar />
        <div className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-red-900 mb-4">Article Not Found</h1>
            <p className="text-red-700 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Button onClick={() => navigate('/blog')} className="gradient-electric text-white hover:opacity-90 shadow-electric-glow hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 text-red-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Electric Particles */}
        <div className="absolute top-40 left-10 w-3 h-3 bg-red-500 rounded-full animate-charge-up opacity-40"></div>
        <div className="absolute top-60 right-32 w-2 h-2 bg-orange-500 rounded-full animate-charge-up opacity-40" style={{ animationDelay: '0.7s' }}></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back Button */}
          <div className="mb-8 animate-slide-in-left">
            <Button 
              onClick={() => navigate('/blog')}
              variant="outline"
              className="border-2 border-red-500/20 text-red-600 hover:bg-red-500/10 hover:border-red-500 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-electric-glow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
          
          {/* Article Header */}
          <div className="text-center mb-12 animate-slide-up-fade">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="bg-red-500 text-white font-black px-6 py-3 text-sm shadow-electric-glow animate-electric-pulse">
                {post.category}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-red-900 mb-6 leading-tight animate-slide-up-fade">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-red-600 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-electric rounded-full flex items-center justify-center shadow-electric-glow">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center justify-center gap-8 text-red-600 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">1.2K views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">89 likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">23 comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-electric-glow transition-all duration-500">
              {/* Electric Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
              <div className="absolute inset-[3px] rounded-3xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark transition-opacity duration-500"></div>
            <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark transition-opacity duration-700" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="relative">
            {/* Electric Border for Content */}
            <div className="absolute -inset-8 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 rounded-3xl animate-energy-flow opacity-50"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-red-200/30">
              <div className="prose prose-lg prose-red max-w-none">
                <div 
                  className="text-red-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-16 pt-8 border-t border-red-200/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-red-900 mb-2">Share this article</h3>
                <p className="text-red-600">Help others discover smart energy insights</p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  className="border-2 border-red-500/20 text-red-600 hover:bg-red-500/10 hover:border-red-500 hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.excerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button 
                  className="gradient-electric text-white hover:opacity-90 shadow-electric-glow hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/blog')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  More Articles
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-red-600 font-bold text-sm">⚡ RELATED ARTICLES ⚡</span>
              </div>
              <h3 className="text-3xl font-black text-red-900">Continue Reading</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost, index) => (
                  <div
                    key={relatedPost.id}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-electric-glow transition-all duration-500 hover:scale-105 transform-gpu">
                      {/* Electric Border */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
                      <div className="absolute inset-[2px] rounded-2xl bg-white"></div>
                      
                      <div className="relative z-10">
                        {/* Image */}
                        <div className="relative overflow-hidden rounded-t-2xl h-48">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500/90 text-white font-bold backdrop-blur-sm">
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 text-sm font-medium">
                              {new Date(relatedPost.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="text-red-400">•</span>
                            <Clock className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 text-sm font-medium">{relatedPost.readTime}</span>
                          </div>
                          
                          <h4 className="text-lg font-black text-red-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                            {relatedPost.title}
                          </h4>
                          
                          <p className="text-red-700 text-sm line-clamp-2 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-electric rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-red-600 text-sm font-medium">{relatedPost.author}</span>
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
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;