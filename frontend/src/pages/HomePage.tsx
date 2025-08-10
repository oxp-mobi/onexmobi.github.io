import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Globe, 
  Smartphone, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Wifi,
  MapPin,
  Users
} from 'lucide-react';
import { seoConfigs, generateSEOTags, formatCurrency } from '../utils/seo';
import { paymentApi } from '../utils/api';

interface eSIMPlan {
  id: string;
  name: string;
  description: string;
  data_allowance: string;
  validity: string;
  coverage: string[];
  price: number;
  currency: string;
}

export const HomePage: React.FC = () => {
  const [plans, setPlans] = useState<eSIMPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const seoTags = generateSEOTags(seoConfigs.home);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await paymentApi.getPlans();
        setPlans(plansData.slice(0, 3)); // Show only top 3 plans on homepage
      } catch (error) {
        console.error('Failed to load plans:', error);
        // Set default plans if API fails
        setPlans([
          {
            id: 'esim_1gb_7days',
            name: 'Tourist 7 Days',
            description: 'Perfect for short visits to Myanmar',
            data_allowance: '1GB',
            validity: '7 Days',
            coverage: ['Myanmar'],
            price: 15000,
            currency: 'MMK'
          },
          {
            id: 'esim_3gb_15days',
            name: 'Business 15 Days',
            description: 'Ideal for business travelers',
            data_allowance: '3GB',
            validity: '15 Days',
            coverage: ['Myanmar'],
            price: 35000,
            currency: 'MMK'
          },
          {
            id: 'esim_5gb_30days',
            name: 'Explorer 30 Days',
            description: 'Best value for extended stays',
            data_allowance: '5GB',
            validity: '30 Days',
            coverage: ['Myanmar'],
            price: 55000,
            currency: 'MMK'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      title: 'Global Coverage',
      description: 'Stay connected across Myanmar with our comprehensive network coverage.'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Instant Activation',
      description: 'Get your eSIM activated within minutes of purchase. No waiting required.'
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with 99.9% network uptime guarantee.'
    },
    {
      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
      title: 'Easy Setup',
      description: 'Simple QR code scanning for instant eSIM installation on your device.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      content: 'eSIM Myanmar made my business trip seamless. Instant connectivity upon arrival!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'David Chen',
      role: 'Tourist',
      content: 'Great coverage and affordable prices. Perfect for my 2-week vacation in Myanmar.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Maya Patel',
      role: 'Digital Nomad',
      content: 'Reliable internet connection for my remote work. Highly recommended for digital nomads.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, value: '50,000+', label: 'Happy Customers' },
    { icon: <Globe className="h-8 w-8" />, value: '99.9%', label: 'Network Uptime' },
    { icon: <MapPin className="h-8 w-8" />, value: '100%', label: 'Myanmar Coverage' },
    { icon: <Clock className="h-8 w-8" />, value: '<5min', label: 'Activation Time' }
  ];

  return (
    <>
      <Helmet {...seoTags} />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-myanmar text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
                Your Gateway to{' '}
                <span className="text-yellow-300">Myanmar Connectivity</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 slide-up">
                Get instant mobile data with our reliable eSIM solutions. 
                No physical SIM cards, no roaming fees, just seamless connectivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/payment" className="btn-primary text-lg px-8 py-4">
                  Get Your eSIM Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/about" className="btn-secondary text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <Wifi className="h-16 w-16 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <Smartphone className="h-20 w-20 animate-pulse" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-orange-500 mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose eSIM Myanmar?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of mobile connectivity with our cutting-edge eSIM technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card text-center group hover:shadow-myanmar">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Perfect Plan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Flexible data plans designed for every type of traveler and usage need
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                  <div 
                    key={plan.id} 
                    className={`card relative ${index === 1 ? 'ring-2 ring-orange-500 shadow-myanmar' : ''}`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      <div className="text-4xl font-bold text-orange-500 mb-2">
                        {formatCurrency(plan.price, plan.currency)}
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>{plan.data_allowance} Data</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>{plan.validity} Validity</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>Myanmar Coverage</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>Instant Activation</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/payment?plan=${plan.id}`}
                      className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        index === 1
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Select Plan
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust eSIM Myanmar for their connectivity needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-myanmar text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Stay Connected in Myanmar?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get your eSIM today and enjoy seamless connectivity from the moment you arrive
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/payment" className="btn-secondary text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100">
                Choose Your Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/contact" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
                Have Questions?
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};