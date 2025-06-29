
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const SkidHavenFooter = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Shipping & Handling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">International</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">SkidHaven Info</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Site Map</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Seller Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">My Account</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Sign In / Register</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Order History</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">My Listings</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Watchlist</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Track Orders</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-3">
              Sign up to receive promotions and special offers!
            </p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address"
                className="bg-gray-800/40 text-white border-gray-700 focus:border-blue-500 h-10"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all font-bold uppercase tracking-wide h-10">
                Subscribe Now
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 py-6">
        <div className="container px-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            <a href="#" className="text-gray-400 hover:text-white text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">Terms & Conditions</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">User Agreement</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">Accessibility</a>
          </div>
          
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} SkidHaven Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SkidHavenFooter;
