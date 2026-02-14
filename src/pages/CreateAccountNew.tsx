import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Mail, Lock, User, Phone, Loader, Check, ArrowRight, Shield } from "lucide-react";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.error || "Registration failed. Please try again.",
      });
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
                  <h2 className="text-navy mb-4">Join Smart Meter Rwanda</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Create your account and start managing your electricity the smart way
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: "Secure & encrypted registration" },
                      { icon: Zap, text: "Instant access to dashboard" },
                      { icon: Check, text: "No hidden fees or charges" },
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-navy">Create Account</h1>
                  <p className="text-muted-foreground">Start your smart energy journey today</p>
                </div>

                {success ? (
                  <div className="text-center py-8 animate-fade-in">
                    <div className="inline-flex p-4 rounded-full bg-secondary/10 mb-4">
                      <Check className="w-12 h-12 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">Account Created!</h3>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-navy font-medium">Full Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10 h-12 border-2 focus:border-primary"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

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
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 h-12 border-2 focus:border-primary"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phoneNumber" className="text-navy font-medium">Phone Number</Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+250 788 123 456"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="pl-10 h-12 border-2 focus:border-primary"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>
                      )}
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
                          value={formData.password}
                          onChange={handleChange}
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
                      {errors.password && (
                        <p className="text-destructive text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword" className="text-navy font-medium">Confirm Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {errors.submit && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive text-sm">{errors.submit}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gradient-electric text-white hover:opacity-90 shadow-electric h-12 text-lg font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4">
                      <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="text-primary hover:underline font-semibold"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateAccount;