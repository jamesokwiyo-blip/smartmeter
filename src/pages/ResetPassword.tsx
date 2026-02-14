import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get token from location state or URL params
    if (location.state?.token) {
      setToken(location.state.token);
    } else {
      // Try to get from URL params
      const params = new URLSearchParams(location.search);
      const urlToken = params.get("token");
      if (urlToken) {
        setToken(urlToken);
      }
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password");
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="glass border-0 shadow-premium p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-gradient-primary shadow-glow mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your reset token and new password
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="token" className="text-navy font-medium">
                    Reset Token
                  </Label>
                  <Input
                    id="token"
                    name="token"
                    type="text"
                    placeholder="Paste your reset token here"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="mt-2 h-12 border-2 focus:border-primary font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get this token from the Forgot Password page
                  </p>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-navy font-medium">
                    New Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-navy font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Forgot Password
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Password Reset Successful!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your password has been reset. Redirecting to login...
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
