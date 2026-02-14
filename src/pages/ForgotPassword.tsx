import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Loader, ArrowLeft, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      console.log("Forgot password response:", response.data);
      if (response.data.success) {
        setSuccess(true);
        // In development, show the token
        if (response.data.resetToken) {
          setResetToken(response.data.resetToken);
          toast.success("Password reset token generated!");
          console.log("Reset Token:", response.data.resetToken);
        } else {
          // Token not in response - check server console
          console.warn("Reset token not in response. Check server console for token.");
          toast.warning("Token generated but not displayed. Check server console.");
        }
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.error || "Failed to process request");
      toast.error(err.response?.data?.error || "Failed to process request");
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
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-navy font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-primary"
                      required
                    />
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Reset Token Generated!
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    In development mode, your reset token is shown below.
                    In production, this would be sent to your email.
                  </p>
                  {resetToken && (
                    <div className="bg-white p-4 rounded border-2 border-green-300 break-all">
                      <p className="text-xs text-muted-foreground mb-2">Reset Token:</p>
                      <p className="text-sm font-mono text-green-900">{resetToken}</p>
                    </div>
                  )}
                  <p className="text-sm text-green-700 mt-4">
                    Use this token on the Reset Password page to set a new password.
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/reset-password", { state: { token: resetToken } })}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow"
                >
                  Go to Reset Password
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </button>
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

export default ForgotPassword;
