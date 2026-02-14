import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Mail, Lock, Loader, ArrowRight, Shield, Check } from "lucide-react";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 gradient-mesh opacity-30 rounded-3xl"></div>
                <Card className="relative glass border-0 shadow-premium p-12">
                  <div className="inline-flex p-4 rounded-2xl gradient-electric mb-6">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-navy mb-4">Welcome Back!</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Sign in to access your dashboard and manage your electricity
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: "Secure login with encryption" },
                      { icon: Zap, text: "Quick access to your meters" },
                      { icon: Check, text: "View purchase history" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <item.icon className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-muted-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <Card className="glass border-0 shadow-electric p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-2xl gradient-electric shadow-electric mb-4 lg:hidden">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-navy">Sign In</h1>
                  <p className="text-muted-foreground">Access your smart meter dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-navy font-medium">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 border-2 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-navy font-medium">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gradient-electric text-white hover:opacity-90 shadow-electric h-12 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/create-account")}
                        className="text-primary hover:underline font-semibold"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;