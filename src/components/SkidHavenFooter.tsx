import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Shield, Zap, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const SkidHavenFooter = () => {
  const { currentTheme } = useTheme();
  
  return (
    <footer className={`${currentTheme.cardBg} border-t ${currentTheme.border}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9c848e6b-b756-4e08-ba12-dde7ca4f3339.png" 
                alt="SkidHaven Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className={`text-lg font-bold ${currentTheme.text} bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent`}>
                SkidHaven
              </span>
            </div>
            <p className={`text-sm ${currentTheme.muted} leading-relaxed`}>
              The premier digital marketplace for secure and anonymous trading of digital goods and services.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className={`${currentTheme.text} hover:${currentTheme.secondary}`}>
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold ${currentTheme.text} mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/sell" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Start Selling
                </Link>
              </li>
              <li>
                <Link to="/messages" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`font-semibold ${currentTheme.text} mb-4`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm ${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`font-semibold ${currentTheme.text} mb-4`}>Stay Updated</h3>
            <p className={`text-sm ${currentTheme.muted} mb-4`}>
              Get the latest updates and exclusive deals.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className={`${currentTheme.secondary} ${currentTheme.text} border-0 flex-1`}
              />
              <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${currentTheme.border} mt-8 pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${currentTheme.muted}`}>
            © 2024 SkidHaven. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-1 text-green-500">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-500">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Fast</span>
            </div>
            <div className="flex items-center space-x-1 text-purple-500">
              <Users className="h-4 w-4" />
              <span className="text-sm">Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SkidHavenFooter;
