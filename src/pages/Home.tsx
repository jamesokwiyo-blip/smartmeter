import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Smartphone, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    name: "Jean Baptiste",
    role: "CEO & Founder",
    bio: "Visionary leader with 15+ years in renewable energy. Passionate about bringing smart energy solutions to Rwanda.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "Marie Claire",
    role: "CTO",
    bio: "Tech innovator specializing in IoT and smart grid technologies. Leading our technical development with excellence.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Patrick Nkurunziza",
    role: "Head of Operations",
    bio: "Operations expert ensuring seamless deployment and customer satisfaction across Rwanda.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
  },
  {
    name: "Grace Uwase",
    role: "Customer Success Manager",
    bio: "Dedicated to delivering exceptional customer experiences and driving product adoption nationwide.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powering Rwanda's Future</span>
            </div>
            
            <h1 className="text-white mb-6 animate-slide-up">
              Smart Energy Management
              <span className="block gradient-primary bg-clip-text text-transparent">
                At Your Fingertips
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in">
              Experience the future of electricity with our intelligent prepaid metering system. 
              Pay only for what you use, track your consumption in real-time, and never worry about unexpected bills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8"
                onClick={() => navigate("/create-account")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 text-lg px-8"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose Smart Meter Rwanda?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary technology designed for modern living
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Smart Technology",
                description: "Advanced IoT-enabled meters with real-time monitoring and analytics",
              },
              {
                icon: Smartphone,
                title: "Easy Management",
                description: "Control everything from your phone - purchase, track, and manage power",
              },
              {
                icon: Clock,
                title: "Instant Activation",
                description: "Get electricity tokens instantly via mobile money or card payment",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Bank-grade security with 24/7 customer support and uptime guarantee",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 glass-card shadow-card hover:shadow-glow transition-smooth group"
              >
                <div className="p-3 rounded-lg bg-gradient-primary w-fit mb-4 group-hover:scale-110 transition-smooth">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals committed to powering Rwanda's energy transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="glass-card shadow-card hover:shadow-glow transition-smooth overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-dark text-white text-center shadow-glow">
            <h2 className="text-white mb-4">Ready to Go Smart?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of Rwandans who have already switched to smart metering
            </p>
            <Button
              size="lg"
              className="bg-white text-navy hover:bg-white/90 text-lg px-8"
              onClick={() => navigate("/create-account")}
            >
              Create Your Account
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
