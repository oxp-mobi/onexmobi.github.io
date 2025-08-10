import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Don't show footer on admin pages
  if (isAdminPath) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-myanmar p-2 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">eSIM Myanmar</h3>
                <p className="text-xs text-gray-400">Your Gateway to Connectivity</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Leading eSIM provider in Myanmar offering reliable and affordable mobile 
              connectivity solutions for travelers and residents.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Get eSIM
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  GDPR Compliance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  PDPA Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Yangon, Myanmar
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400 text-sm">+95 9 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400 text-sm">info@esim.com.mm</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3">Accepted Payments</h5>
              <div className="flex flex-wrap gap-2">
                <img src="https://i.ibb.co/LDy981F3/mpu.png" alt="MPU" className="h-6 bg-white rounded px-1" />
                <img src="https://i.ibb.co/Xx7S2N1n/visa-master.png" alt="Visa/Mastercard" className="h-6 bg-white rounded px-1" />
                <img src="https://i.ibb.co/4wJHrhKX/uabpay.png" alt="UABPay" className="h-6 bg-white rounded px-1" />
                <img src="https://i.ibb.co/gb53dCHM/MMQR.png" alt="MMQR" className="h-6 bg-white rounded px-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} eSIM Myanmar. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Powered by Transactease Payment Gateway
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};