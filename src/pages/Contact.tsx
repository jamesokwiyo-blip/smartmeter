import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Send, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Toll-Free Number",
      details: "8000 (Free from MTN & Airtel)",
      link: "tel:8000",
      color: "text-primary"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@smartmeterrwanda.rw",
      link: "mailto:support@smartmeterrwanda.rw",
      color: "text-secondary"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "KG 9 Ave, Kigali, Rwanda",
      link: "https://maps.google.com",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon - Fri: 8AM - 6PM",
      link: null,
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-40"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-in">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold text-sm">We're Here to Help</span>
          </div>
          
          <h1 className="mb-6 text-navy animate-slide-up">
            Get in Touch
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="p-6 glass hover-lift border-0 shadow-premium group cursor-pointer"
                onClick={() => info.link && window.open(info.link, '_blank')}
              >
                <div className={`p-3 rounded-xl gradient-electric w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-navy">{info.title}</h3>
                <p className={`text-sm ${info.color} font-medium`}>{info.details}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Map */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 glass border-0 shadow-premium">
              <h2 className="text-3xl font-bold mb-6 text-navy">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-2 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+250 7XX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="border-2 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="border-2 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border-2 border-input rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gradient-green-vibrant text-white hover:opacity-90 shadow-green-glow hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-0 shadow-premium">
                <div className="h-[400px]">
                  <iframe 
                    src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=-1.9441,30.0619&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                    width="100%" 
                    height="400" 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                  ></iframe>
                </div>
              </Card>

              <Card className="p-8 glass border-0 shadow-premium">
                <h3 className="text-2xl font-bold mb-4 text-navy">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-6">
                  For urgent matters or technical support, call our toll-free number available 24/7.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div className="p-3 rounded-full gradient-green-vibrant shadow-green-glow">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Toll-Free Support</p>
                      <p className="text-2xl font-bold text-primary">8000</p>
                      <p className="text-xs text-muted-foreground">Free from MTN & Airtel</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
                    <div className="p-3 rounded-full bg-gradient-to-br from-secondary to-primary">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Support</p>
                      <p className="text-lg font-semibold text-secondary">support@smartmeterrwanda.rw</p>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;