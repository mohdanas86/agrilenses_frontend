import React from "react";
import Link from "next/link";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Github,
  Linkedin,
  User2,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PlantAI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced AI-powered plant disease detection system helping farmers
              protect their crops with instant, accurate diagnosis and treatment
              recommendations.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/@_anas__86"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com/c/AG4444YT"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/mohdanas86"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/anas86"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://anasalamportfolio.netlify.app"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <User2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-green-400">Services</h6>
            <nav className="space-y-2">
              <Link
                href="/dashboard/scanner"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Disease Detection
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Plant Analysis
              </Link>
              <Link
                href="/dashboard/history"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Scan History
              </Link>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Treatment Recommendations
              </a>
            </nav>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-green-400">Company</h6>
            <nav className="space-y-2">
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Our Technology
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Research
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Careers
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h6 className="text-lg font-semibold text-green-400">Contact</h6>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@agrilenses.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">AgriLenses Tech Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 AgriLenses. All rights reserved. Powered by advanced
              machine learning.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
