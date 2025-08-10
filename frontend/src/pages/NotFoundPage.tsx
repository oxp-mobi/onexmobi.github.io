import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - eSIM Myanmar</title>
        <meta name="description" content="The page you're looking for could not be found. Return to eSIM Myanmar homepage." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</div>
            <p className="text-gray-600">
              Sorry, the page you are looking for could not be found or has been moved.
            </p>
          </div>

          {/* Search Suggestions */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Search className="h-5 w-5 mr-2 text-orange-500" />
              Popular Pages
            </h3>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
              >
                🏠 Homepage - Browse eSIM plans
              </Link>
              <Link 
                to="/payment" 
                className="block text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
              >
                💳 Get eSIM - Purchase plans
              </Link>
              <Link 
                to="/about" 
                className="block text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
              >
                ℹ️ About Us - Learn more
              </Link>
              <Link 
                to="/contact" 
                className="block text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
              >
                📞 Contact - Get support
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="btn-primary w-full flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary w-full flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Still can't find what you're looking for?</p>
            <Link to="/contact" className="text-orange-500 hover:text-orange-600 font-medium">
              Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};