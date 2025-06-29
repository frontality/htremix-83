
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const SkidHavenFooter = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">SkidHaven</h3>
            <ul className="space-y-2">
              <li><a href="/marketplace" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Marketplace</a></li>
              <li><a href="/sell" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Sell Items</a></li>
              <li><a href="/crypto-exchange" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Crypto Exchange</a></li>
              <li><a href="/messages" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Messages</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Account</h3>
            <ul className="space-y-2">
              <li><a href="/login" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Login</a></li>
              <li><a href="/signup" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Sign Up</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-blue-500 transition-colors text-sm">Profile</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-3">
              Sign up to receive updates and special offers!
            </p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address"
                className="bg-gray-800/40 text-white border-gray-700 focus:border-blue-500 h-10"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 transition-all font-bold uppercase tracking-wide h-10 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Subscribe
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-lg uppercase mb-4 tracking-wider">Connect</h3>
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
          </div>
          
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} SkidHaven. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SkidHavenFooter;
