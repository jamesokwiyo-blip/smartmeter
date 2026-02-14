import { Link } from "react-router-dom";
import { Zap, Battery, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HomeElectric = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Energy Management
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Monitor and manage your prepaid electricity with our advanced IoT-based smart meter system.
              Real-time tracking, instant token purchases, and complete energy insights.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/create-account">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Track your energy consumption in real-time with live voltage, current, and power readings.
                </p>
              </Card>
              
              <Card className="p-6">
                <Battery className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Prepaid System</h3>
                <p className="text-sm text-muted-foreground">
                  Buy electricity tokens instantly and manage your energy budget effectively.
                </p>
              </Card>
              
              <Card className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with encrypted data transmission and secure authentication.
                </p>
              </Card>
              
              <Card className="p-6">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Usage History</h3>
                <p className="text-sm text-muted-foreground">
                  Access detailed consumption reports and analyze your energy usage patterns.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users managing their energy consumption smartly.
            </p>
            <Link to="/create-account">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeElectric;
