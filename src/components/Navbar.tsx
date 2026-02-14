import { useNavigate } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("user");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="p-2 gradient-electric rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-electric">Smart Meter Rwanda</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/" 
              className="text-navy hover:text-primary transition-colors font-medium"
            >
              Home
            </a>
            <a 
              href="/#about" 
              className="text-navy hover:text-primary transition-colors font-medium"
            >
              About
            </a>
            <a 
              href="/#team" 
              className="text-navy hover:text-primary transition-colors font-medium"
            >
              Team
            </a>
            <a 
              href="/blog" 
              className="text-navy hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/blog");
              }}
            >
              Blog
            </a>
            <a 
              href="/contact" 
              className="text-navy hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
            >
              Contact
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/create-account")}
                  className="gradient-electric text-white hover:opacity-90 shadow-electric"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-navy hover:bg-muted transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <a 
              href="/" 
              className="block px-4 py-2 text-navy hover:bg-muted rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a 
              href="/#about" 
              className="block px-4 py-2 text-navy hover:bg-muted rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              href="/#team" 
              className="block px-4 py-2 text-navy hover:bg-muted rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Team
            </a>
            <a 
              href="/blog" 
              className="block px-4 py-2 text-navy hover:bg-muted rounded-lg transition-all"
              onClick={() => {
                setIsOpen(false);
                navigate("/blog");
              }}
            >
              Blog
            </a>
            <a 
              href="/contact" 
              className="block px-4 py-2 text-navy hover:bg-muted rounded-lg transition-all"
              onClick={() => {
                setIsOpen(false);
                navigate("/contact");
              }}
            >
              Contact
            </a>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary/5"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary/5"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/create-account");
                      setIsOpen(false);
                    }}
                    className="w-full gradient-electric text-white hover:opacity-90 shadow-electric"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;