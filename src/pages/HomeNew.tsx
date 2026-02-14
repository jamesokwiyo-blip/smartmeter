import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Shield, Gauge, Clock, ArrowRight, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Recharge",
      description: "Get electricity tokens in seconds with seamless mobile money integration"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Bank-grade encryption protects every transaction and your personal data"
    },
    {
      icon: Gauge,
      title: "Real-Time Monitoring",
      description: "Track your consumption patterns and manage usage efficiently"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Expert assistance available around the clock for any concerns"
    }
  ];

  const teamMembers = [
    {
      name: "MPATSWENUMUGABO Janvier",
      role: "UX Researcher",
      image: "/team/janvier.png",
      delay: "0s"
    },
    {
      name: "UMUTONIWASE Regine",
      role: "Project Manager",
      image: "/team/regine.png",
      delay: "0.1s"
    },
    {
      name: "NDIKUYERA Simon",
      role: "Product Manager",
      image: "/team/simon.png",
      delay: "0.2s"
    },
    {
      name: "UWIMBABAZI Bernadette",
      role: "Product Manager",
      image: "/team/bernadette.png",
      delay: "0.3s"
    },
    {
      name: "UWAYEZU Alice",
      role: "Data Analyst",
      image: "/team/alice.png",
      delay: "0.4s"
    }
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Active Users" },
    { icon: Zap, value: "2M+", label: "kWh Delivered" },
    { icon: TrendingUp, value: "99.9%", label: "Uptime" },
    { icon: Award, value: "#1", label: "In Rwanda" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-40"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Decorative Elements with Electric Effects */}
        <div className="absolute top-32 left-10 w-20 h-20 border-4 border-primary/20 rounded-full animate-float shadow-green-glow animate-electric-pulse"></div>
        <div className="absolute bottom-32 right-10 w-16 h-16 border-4 border-primary/20 rounded-full animate-float animate-electric-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 gradient-green-vibrant rounded-lg animate-float opacity-30 animate-electric-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-accent/20 rounded-full animate-bounce-slow">
          <div className="w-full h-full rounded-full bg-primary animate-electric-spark"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-primary/20 rounded-full animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
          <div className="w-full h-full rounded-full bg-accent animate-electric-spark"></div>
        </div>
        
        {/* Electric Particles */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary rounded-full animate-charge-up opacity-40"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-charge-up opacity-40" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-primary rounded-full animate-charge-up opacity-40" style={{ animationDelay: '1.4s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-slide-up-fade">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 shadow-sm hover:shadow-green-glow transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-primary font-semibold text-sm">Rwanda's #1 Smart Meter Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 leading-tight">
              <span className="block text-navy animate-slide-in-left">Power Your Life with</span>
              <span className="block text-gradient-green-glow animate-gradient-shift animate-slide-in-right" style={{ animationDelay: '0.2s' }}>Smart Meter Rwanda</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Experience the future of electricity management. Pay only for what you use, 
              track consumption in real-time, and never worry about unexpected bills.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Button
                className="gradient-green-vibrant text-white hover:opacity-90 shadow-green-glow hover:shadow-2xl hover:scale-105 px-6 group transition-all duration-300"
                onClick={() => navigate("/create-account")}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 px-6 transition-all duration-300 shadow-sm hover:shadow-green-glow"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="p-6 text-center glass hover-lift hover-scale border-0 shadow-premium group cursor-pointer animate-slide-up-fade overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="p-3 rounded-full gradient-green-vibrant w-fit mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-green-glow">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-navy mb-1 group-hover:text-primary transition-colors duration-300 group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>

                {/* Decorative Corner Glow */}
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-semibold text-sm">Why Choose Us</span>
            </div>
            <h2 className="mb-4 text-navy">Revolutionary Smart Metering</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology designed for modern living in Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative p-8 glass hover-glow border-0 shadow-premium group cursor-pointer transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                
                {/* Icon with Electric Glow */}
                <div className="relative p-4 rounded-2xl gradient-electric w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-green-glow animate-electric-pulse">
                  <feature.icon className="w-8 h-8 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Electric Sparks */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-electric-spark" style={{ animationDelay: '0.2s' }}></div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-navy group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                
                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-electric opacity-5 rounded-tl-full transform translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-navy">Simple. Fast. Reliable.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up in seconds with your phone number and email"
              },
              {
                step: "02",
                title: "Add Meter",
                description: "Enter your meter number and choose payment method"
              },
              {
                step: "03",
                title: "Buy Electricity",
                description: "Purchase power instantly and receive your token immediately"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3 text-navy">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-electric"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Simple & Creative Circular Design */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-muted/30">
        {/* Subtle Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Simple Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-3">
              Meet The Team
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Passionate innovators transforming Rwanda's energy landscape
            </p>
          </div>

          {/* Simple Grid with Circular Photos */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center">
                  {/* Circular Photo with Hover Effect */}
                  <div className="relative mb-4">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-electric opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                    
                    {/* Photo Container */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-500">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://i.pravatar.cc/300?u=${member.name}`;
                        }}
                      />
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-electric opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    </div>

                    {/* Decorative Dot */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center max-w-[140px]">
                    <h3 className="font-bold text-base text-navy mb-1 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Stats Bar */}
          <div className="mt-32 pt-12 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Team Members', value: '5' },
                { label: 'Combined Experience', value: '20+ Years' },
                { label: 'Projects Delivered', value: '100+' },
                { label: 'Client Satisfaction', value: '99%' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl md:text-5xl font-black text-navy mb-2 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                  <div className="w-12 h-1 bg-primary mx-auto mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-electric">
            <div className="absolute inset-0 gradient-electric opacity-95"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            
              <div className="relative z-10 p-12 text-center text-white">
              <div className="relative inline-block mb-6">
                <Zap className="w-16 h-16 animate-electric-pulse" />
                {/* Electric Sparks around Zap icon */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-electric-spark"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.6s' }}></div>
              </div>
              <h2 className="text-white mb-4 animate-slide-up-fade">Ready to Go Smart?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Rwandans who have already switched to intelligent energy management
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-premium"
                onClick={() => navigate("/create-account")}
              >
                Create Your Account Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;