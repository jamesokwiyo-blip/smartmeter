import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-navy text-white">
      <div className="absolute inset-0 gradient-dark opacity-95"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 gradient-electric rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-electric">Smart Meter Rwanda</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Revolutionizing energy management in Rwanda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="text-white/70 hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#team" className="text-white/70 hover:text-primary transition-colors text-sm">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white/70 hover:text-primary transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@smartmeterrwanda.com" className="text-white/70 hover:text-primary transition-colors text-sm">
                  info@smartmeterrwanda.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-white/70 text-sm">+250 788 123 456</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-white/70 text-sm mb-1">
            &copy; 2025 Smart Meter Rwanda. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            Developed by Amani Alain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;