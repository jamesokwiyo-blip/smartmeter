import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Zap, Shield, Gauge, Clock, ArrowRight, Sparkles, TrendingUp, Users, Award,
  Play, Calendar, User, ExternalLink, Youtube, BookOpen, Lightbulb, Battery,
  Power, Activity, BarChart3, Wifi, Smartphone, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomeElectric = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Power",
      description: "Get electricity tokens in seconds with lightning-fast processing",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Ultra Secure",
      description: "Military-grade encryption protects every transaction",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Gauge,
      title: "Smart Monitoring",
      description: "Real-time consumption tracking with AI-powered insights",
      color: "from-yellow-500 to-red-500"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Round-the-clock service with instant support",
      color: "from-red-600 to-pink-500"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Smart Meters: The Future of Energy Management in Rwanda",
      excerpt: "Discover how smart meters are revolutionizing electricity consumption tracking and helping Rwandans save money on their energy bills.",
      author: "Energy Expert Team",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      category: "Technology"
    },
    {
      id: 2,
      title: "10 Tips to Reduce Your Electricity Bill This Month",
      excerpt: "Learn practical strategies to optimize your energy consumption and significantly reduce your monthly electricity costs.",
      author: "Sustainability Team",
      date: "2024-01-12",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
      category: "Tips"
    },
    {
      id: 3,
      title: "Rwanda's Green Energy Revolution: What You Need to Know",
      excerpt: "Explore Rwanda's commitment to renewable energy and how it's shaping the future of electricity in the country.",
      author: "Policy Team",
      date: "2024-01-10",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop",
      category: "Environment"
    }
  ];

  const youtubeVideos = [
    {
      id: "dQw4w9WgXcQ",
      title: "How to Use Smart Meter Rwanda Platform",
      thumbnail: "https://picsum.photos/800/450?random=1",
      duration: "3:45",
      views: "12K views"
    },
    {
      id: "jNQXAC9IVRw",
      title: "Understanding Your Electricity Meter",
      thumbnail: "https://picsum.photos/800/450?random=2",
      duration: "5:20",
      views: "8.5K views"
    },
    {
      id: "y6120QOlsfU",
      title: "Mobile Money Integration Tutorial",
      thumbnail: "https://picsum.photos/800/450?random=3",
      duration: "4:15",
      views: "15K views"
    }
  ];

  const stats = [
    { icon: Users, value: "75,000+", label: "Active Users", color: "text-red-500" },
    { icon: Zap, value: "5M+", label: "kWh Delivered", color: "text-orange-500" },
    { icon: TrendingUp, value: "99.9%", label: "Uptime", color: "text-yellow-500" },
    { icon: Award, value: "#1", label: "In Rwanda", color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen bg-white text-red-900">
      <Navbar />
      
      {/* Hero Section with Electric Background */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4 sm:px-6 lg:px-8 electricity-bg meter-pattern">
        {/* Dynamic Electric Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 opacity-80"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZWxlY3RyaWMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cGF0aCBkPSJNNTAgMEw2MCAyMEg0MEw1MCA0MEw0MCA2MEg2MEw1MCAxMDBMNDAgODBINjBMNTAgNjBMNjAgNDBINDBMNTAgMjBMNjAgMEg0MEw1MCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMCwgMCwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNlbGVjdHJpYykiLz48L3N2Zz4=')] opacity-10"></div>
        </div>
        
        {/* Floating Electric Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Interactive Electric Sparks & Meters */}
        <div className="absolute top-32 left-20 w-24 h-24 border-4 border-red-500/30 rounded-full animate-float shadow-electric-glow animate-electric-pulse">
          <div className="absolute inset-2 border-2 border-orange-500/40 rounded-full animate-meter-spin"></div>
          <div className="absolute inset-4 bg-red-500/20 rounded-full animate-voltage-pulse"></div>
        </div>
        <div className="absolute bottom-32 right-20 w-20 h-20 border-4 border-orange-500/30 rounded-full animate-float animate-electric-pulse" style={{ animationDelay: '1s' }}>
          <div className="absolute inset-1 border-2 border-yellow-500/40 rounded-full animate-meter-spin" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute top-1/2 right-32 w-16 h-16 gradient-electric rounded-lg animate-float opacity-40 animate-electric-pulse" style={{ animationDelay: '2s' }}>
          <div className="absolute inset-1 bg-white/30 rounded-md animate-voltage-pulse"></div>
        </div>
        
        {/* Advanced Electric Meter Visuals */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/20 rounded-full animate-bounce-slow">
          <div className="w-full h-full rounded-full bg-red-500 animate-electric-spark relative">
            <div className="absolute inset-1 border border-white/50 rounded-full animate-meter-spin"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-white transform -translate-x-1/2 -translate-y-1/2 animate-meter-spin"></div>
          </div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-orange-500/20 rounded-full animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
          <div className="w-full h-full rounded-full bg-orange-500 animate-electric-spark relative">
            <div className="absolute inset-1 border border-white/50 rounded-full animate-meter-spin" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-5 bg-white transform -translate-x-1/2 -translate-y-1/2 animate-meter-spin" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        {/* Digital Display Elements */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-red-400 px-4 py-2 rounded font-mono text-sm animate-pulse">
          ⚡ 240V | 50Hz | ACTIVE
        </div>
        <div className="absolute bottom-20 right-10 bg-black/80 text-orange-400 px-3 py-1 rounded font-mono text-xs animate-pulse" style={{ animationDelay: '1s' }}>
          kWh: 1,247.8
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-slide-up-fade">
            {/* Electric Badge with Meter Display */}
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-full mb-8 shadow-sm hover:shadow-electric-glow transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 animate-energy-flow"></div>
              <div className="relative w-8 h-8 border-2 border-red-500/40 rounded-full animate-meter-spin">
                <Zap className="w-4 h-4 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-electric-spark" />
              </div>
              <span className="text-red-600 font-black text-sm relative z-10">⚡ RWANDA'S SMARTEST ELECTRIC PORTAL ⚡</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Heading with Electric Effect */}
            <h1 className="mb-6 leading-tight">
              <span className="block text-red-900 animate-slide-in-left text-6xl md:text-8xl font-black">Electrify Your</span>
              <span className="block text-gradient-electric-glow animate-gradient-shift animate-slide-in-right text-6xl md:text-8xl font-black" style={{ animationDelay: '0.2s' }}>Smart Living</span>
            </h1>

            {/* Slogan */}
            <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-2xl md:text-3xl font-bold text-gradient-electric-glow mb-2">
                "Real Time Energy, Real Time Control"
              </p>
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-red-700 max-w-3xl mx-auto mb-12 leading-normal animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Experience Rwanda's most innovative electricity management platform. Smart meters, instant payments, real-time monitoring - all in one place!
            </p>

            {/* Electric CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Button
                size="lg"
                className="gradient-electric text-white hover:opacity-90 shadow-electric-glow hover:shadow-2xl hover:scale-110 px-8 py-4 group transition-all duration-300 text-lg font-bold"
                onClick={() => navigate("/create-account")}
              >
                <Zap className="mr-3 w-6 h-6 animate-electric-spark" />
                Start Electric Journey
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-3 border-red-500 text-red-600 hover:bg-red-500/10 hover:scale-110 px-8 py-4 transition-all duration-300 shadow-sm hover:shadow-electric-glow text-lg font-bold"
                onClick={() => navigate("/login")}
              >
                <Power className="mr-2 w-5 h-5" />
                Power Login
              </Button>
            </div>
          </div>

          {/* Enhanced Stats with Electric Theme & Live Meter Display */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto bg-black/90 rounded-3xl p-8 border border-red-500/30 shadow-electric-glow relative overflow-hidden">
              <div className="absolute inset-0 electric-circuit opacity-20"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-red-400 mb-2">⚡ LIVE SYSTEM STATUS ⚡</h3>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-mono">ONLINE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-mono">99.9% UPTIME</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-mono">5G CONNECTED</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-red-400 mb-1 font-mono">240V</div>
                    <div className="text-xs text-red-300">VOLTAGE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-orange-400 mb-1 font-mono">50Hz</div>
                    <div className="text-xs text-orange-300">FREQUENCY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400 mb-1 font-mono">15.2A</div>
                    <div className="text-xs text-yellow-300">CURRENT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-400 mb-1 font-mono">3.6kW</div>
                    <div className="text-xs text-green-300">POWER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-0">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="p-8 text-center glass hover-lift hover-scale border-0 shadow-premium group cursor-pointer animate-slide-up-fade overflow-hidden relative bg-white/90 backdrop-blur-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="p-4 rounded-full gradient-electric w-fit mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-electric-glow">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`text-4xl font-black mb-2 ${stat.color} group-hover:scale-125 transition-all duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-red-700 font-semibold group-hover:text-red-600 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="-mt-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-orange-50 meter-pattern">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <Lightbulb className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-red-600 font-bold text-sm">⚡ REVOLUTIONARY FEATURES ⚡</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-red-900 mb-4">Electric Innovation</h2>
            <p className="text-lg text-red-700 max-w-2xl mx-auto">
              Cutting-edge technology powering Rwanda's energy future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative p-6 glass hover-glow border-0 shadow-premium group cursor-pointer transition-all duration-500 overflow-hidden bg-white/95 backdrop-blur-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${feature.color} w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-electric-glow animate-electric-pulse overflow-hidden`}>
                  <feature.icon className="w-8 h-8 text-white relative z-10" />
                  
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark"></div>
                  
                  {/* Voltage Indicator */}
                  <div className="absolute top-1 right-1 text-xs text-white/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index === 0 ? '⚡240V' : index === 1 ? '🔒SSL' : index === 2 ? '📊kWh' : '🕐24/7'}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-red-900 group-hover:text-red-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-red-700 leading-relaxed text-sm">{feature.description}</p>
                
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-electric opacity-5 rounded-tl-full transform translate-x-8 translate-y-8 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive How It Works */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white electricity-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-red-900 mb-4">⚡ Power Process ⚡</h2>
            <p className="text-xl text-red-700 max-w-2xl mx-auto">
              Three electric steps to energy freedom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Smartphone,
                title: "Quick Setup",
                description: "Create account instantly with mobile verification"
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Smart Payment",
                description: "Add meter and choose from multiple payment options"
              },
              {
                step: "03",
                icon: Battery,
                title: "Instant Power",
                description: "Get electricity tokens immediately via SMS"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl font-black text-red-500/20 mb-5 group-hover:text-red-500/40 transition-colors duration-300">{item.step}</div>
                
                <div className="p-5 rounded-2xl gradient-electric w-fit mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-electric-glow">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-red-900 group-hover:text-red-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-red-700 leading-relaxed text-base">{item.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-14 -right-5 w-10 h-0.5 bg-gradient-electric animate-energy-flow"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
              <BookOpen className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-red-600 font-bold text-sm">⚡ ENERGY INSIGHTS ⚡</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-red-900 mb-6">Electric Blog</h2>
            <p className="text-2xl text-red-700 max-w-3xl mx-auto font-medium">
              🔥 Latest insights on smart energy management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={post.id}
                className="group cursor-pointer animate-fade-in relative"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                {/* Main Card */}
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-electric-glow hover:shadow-2xl transition-all duration-700 hover:scale-105 transform-gpu">
                  {/* Electric Border Animation */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
                  <div className="absolute inset-[2px] rounded-3xl bg-white"></div>
                  
                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Image Section */}
                    <div className="relative overflow-hidden rounded-t-3xl h-56">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                          <span className="text-white font-bold text-sm">{post.category}</span>
                        </div>
                      </div>
                      
                      {/* Read Time Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-white text-xs font-medium">{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Electric Sparks */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-electric-spark"></div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 text-sm font-medium">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-black text-red-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-red-700 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Author & CTA */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-red-600 text-sm font-medium">{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-red-500 group-hover:text-red-600 transition-colors duration-300 group-hover:translate-x-1 transform">
                          <span className="text-sm font-bold">Read More</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark transition-opacity duration-500"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark transition-opacity duration-700" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-500 text-red-600 hover:bg-red-500/10 hover:scale-105 px-8 py-4 transition-all duration-300 shadow-sm hover:shadow-electric-glow text-lg font-bold"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-red-50">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
              <Users className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-red-600 font-bold text-sm">⚡ OUR TEAM ⚡</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-red-900 mb-6">Meet The Team</h2>
            <p className="text-2xl text-red-700 max-w-3xl mx-auto font-medium">
              🔥 Passionate innovators transforming Rwanda's energy landscape
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              {
                name: "MPATSWENUMUGABO Janvier",
                role: "UX Researcher",
                image: "/team/janvier.png"
              },
              {
                name: "UMUTONIWASE Regine",
                role: "Project Manager",
                image: "/team/regine.png"
              },
              {
                name: "NDIKUYERA Simon",
                role: "Product Manager",
                image: "/team/simon.png"
              },
              {
                name: "UWIMBABAZI Bernadette",
                role: "Product Manager",
                image: "/team/bernadette.png"
              },
              {
                name: "UWAYEZU Alice",
                role: "Data Analyst",
                image: "/team/alice.png"
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-electric opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                    
                    <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://i.pravatar.cc/300?u=${member.name}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-electric opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>

                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                  </div>

                  <div className="text-center max-w-[140px]">
                    <h3 className="font-bold text-base text-red-900 mb-1 group-hover:text-red-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-xs text-red-600 font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-red-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Team Members', value: '5' },
                { label: 'Combined Experience', value: '20+ Years' },
                { label: 'Projects Delivered', value: '100+' },
                { label: 'Client Satisfaction', value: '99%' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-red-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-red-700 font-medium">
                    {stat.label}
                  </div>
                  <div className="w-12 h-1 bg-red-500 mx-auto mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured YouTube Videos */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white electricity-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
              <Youtube className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-red-600 font-bold text-sm">⚡ VIDEO TUTORIALS ⚡</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-red-900 mb-6">Electric Tutorials</h2>
            <p className="text-2xl text-red-700 max-w-3xl mx-auto font-medium">
              🎥 Master your smart meter with our video guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {youtubeVideos.map((video, index) => (
              <Card
                key={video.id}
                className="group cursor-pointer overflow-hidden border-0 shadow-premium hover:shadow-electric-glow transition-all duration-500 hover:scale-105 bg-white/95 backdrop-blur-xl"
                onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-red-600 transition-all duration-300 shadow-electric-glow">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <Badge className="absolute bottom-4 right-4 bg-black/80 text-white font-bold">
                    {video.duration}
                  </Badge>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-red-900 mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600 font-medium">{video.views}</span>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-500 group-hover:translate-x-1 transition-transform duration-300">
                      Watch Now <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-500 text-red-600 hover:bg-red-500/10 hover:scale-105 px-8 py-4 transition-all duration-300 shadow-sm hover:shadow-electric-glow text-lg font-bold"
              onClick={() => window.open('https://youtube.com/@smartmeterrwanda', '_blank')}
            >
              <Youtube className="mr-2 w-5 h-5" />
              Visit Our Channel
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-electric-glow">
            <div className="absolute inset-0 gradient-electric opacity-95"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZWxlY3RyaWMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cGF0aCBkPSJNNTAgMEw2MCAyMEg0MEw1MCA0MEw0MCA2MEg2MEw1MCAxMDBMNDAgODBINjBMNTAgNjBMNjAgNDBINDBMNTAgMjBMNjAgMEg0MEw1MCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNlbGVjdHJpYykiLz48L3N2Zz4=')] opacity-20"></div>
            
            <div className="relative z-10 p-16 text-center text-white">
              <div className="relative inline-block mb-8">
                <Zap className="w-24 h-24 animate-electric-pulse" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full animate-electric-spark"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.6s' }}></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 animate-slide-up-fade">
                ⚡ Ready to Go Electric? ⚡
              </h2>
              <p className="text-2xl text-white/95 mb-12 max-w-4xl mx-auto font-medium">
                🔥 Join 75,000+ Rwandans who have revolutionized their energy management with our smart platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-white/90 shadow-premium hover:scale-110 px-10 py-5 text-xl font-black transition-all duration-300"
                  onClick={() => navigate("/create-account")}
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  Start Electric Journey Now
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-white text-white hover:bg-white/10 hover:scale-110 px-10 py-5 text-xl font-black transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  <Power className="mr-2 w-6 h-6" />
                  Power Login
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeElectric;