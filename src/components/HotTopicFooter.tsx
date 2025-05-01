
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const HotTopicFooter = () => {
  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="container px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Customer Service column */}
          <div>
            <h3 className="font-futura text-lg uppercase mb-4 tracking-wider">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Shipping & Handling</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">International</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Size Chart</a></li>
            </ul>
          </div>
          
          {/* Hot Topic Info column */}
          <div>
            <h3 className="font-futura text-lg uppercase mb-4 tracking-wider">Hot Topic Info</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Store Locator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Site Map</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Guest Order Lookup</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Gift Cards</a></li>
            </ul>
          </div>
          
          {/* My Account column */}
          <div>
            <h3 className="font-futura text-lg uppercase mb-4 tracking-wider">My Account</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Sign In / Register</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Order History</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">My Wishlist</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Guest Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-hottopic-red transition-colors text-sm">Track My Order</a></li>
            </ul>
          </div>
          
          {/* Newsletter signup */}
          <div>
            <h3 className="font-futura text-lg uppercase mb-4 tracking-wider">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-3">
              Sign up to receive promotions and special offers!
            </p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address"
                className="bg-hottopic-gray/40 text-white border-none focus:outline-none focus:ring-1 focus:ring-hottopic-red h-10"
              />
              <Button className="bg-hottopic-red hover:bg-hottopic-red/90 transition-all font-futura uppercase tracking-wide h-10">
                Subscribe Now
              </Button>
            </div>
            
            {/* Social media */}
            <div className="mt-6">
              <h3 className="font-futura text-lg uppercase mb-4 tracking-wider">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-hottopic-gray flex items-center justify-center hover:bg-hottopic-red transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-hottopic-gray flex items-center justify-center hover:bg-hottopic-red transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-hottopic-gray flex items-center justify-center hover:bg-hottopic-red transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-hottopic-gray flex items-center justify-center hover:bg-hottopic-red transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer bottom - legal info only (payment methods removed) */}
      <div className="border-t border-hottopic-gray/30 py-6">
        <div className="container px-4">
          {/* Legal links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            <a href="#" className="text-gray-400 hover:text-white text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">Terms & Conditions</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">CA Privacy Rights</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">Do Not Sell My Info</a>
            <a href="#" className="text-gray-400 hover:text-white text-xs">Accessibility</a>
          </div>
          
          {/* Copyright */}
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Hot Topic Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HotTopicFooter;
