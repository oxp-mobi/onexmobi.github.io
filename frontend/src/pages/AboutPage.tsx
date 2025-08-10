import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe, Shield, Users, Award, Target, Heart, CheckCircle } from 'lucide-react';
import { seoConfigs, generateSEOTags } from '../utils/seo';

export const AboutPage: React.FC = () => {
  const seoTags = generateSEOTags(seoConfigs.about);

  const values = [
    {
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      title: 'Global Connectivity',
      description: 'We believe everyone deserves reliable internet access, wherever they are in Myanmar.'
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: 'Security First',
      description: 'Your data privacy and security are our top priorities in everything we do.'
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: 'Customer Centric',
      description: 'Our customers are at the heart of every decision and innovation we make.'
    },
    {
      icon: <Heart className="h-8 w-8 text-orange-500" />,
      title: 'Local Commitment',
      description: 'We are committed to supporting Myanmar\'s digital transformation journey.'
    }
  ];

  const milestones = [
    { year: '2023', title: 'Company Founded', description: 'eSIM Myanmar was established to revolutionize mobile connectivity in Myanmar.' },
    { year: '2023', title: 'First eSIM Launch', description: 'Successfully launched our first eSIM service with major network partners.' },
    { year: '2024', title: '10,000+ Customers', description: 'Reached our first major milestone of serving over 10,000 satisfied customers.' },
    { year: '2024', title: 'Payment Integration', description: 'Integrated with local payment methods including MPU, UABPay, and MMQR.' },
    { year: '2025', title: 'National Coverage', description: 'Achieved 100% coverage across Myanmar with multiple carrier partnerships.' }
  ];

  const team = [
    {
      name: 'Kaung Htet Paing',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      description: 'Technology leader with expertise in telecommunications and digital innovation.'
    },
    {
      name: 'Myanmar Team',
      role: 'Development Team',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      description: 'Dedicated team of local developers and engineers building the future of connectivity.'
    },
    {
      name: 'Customer Support',
      role: 'Support Team',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      description: '24/7 multilingual support team ready to assist customers in Myanmar and English.'
    }
  ];

  return (
    <>
      <Helmet {...seoTags} />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-myanmar text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">
                About eSIM Myanmar
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 slide-up">
                Connecting Myanmar to the digital world through innovative eSIM technology
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    At eSIM Myanmar, we're on a mission to democratize mobile connectivity across Myanmar. 
                    We believe that reliable internet access shouldn't be a luxury – it should be accessible 
                    to everyone, whether you're a local resident, business traveler, or tourist exploring 
                    our beautiful country.
                  </p>
                  <p className="text-lg text-gray-700 mb-8">
                    Through cutting-edge eSIM technology, we're eliminating the barriers that have traditionally 
                    made mobile connectivity complicated and expensive. Our goal is to make getting connected 
                    in Myanmar as simple as scanning a QR code.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">Instant activation within 5 minutes</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">No physical SIM cards required</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">Transparent pricing with no hidden fees</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">24/7 customer support</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Myanmar landscape with modern connectivity"
                    className="rounded-lg shadow-myanmar"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do and shape our commitment to Myanmar's digital future
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card text-center group hover:shadow-myanmar">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From startup to Myanmar's leading eSIM provider - here are the milestones that shaped our story
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-orange-500"></div>
                
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="card hover:shadow-myanmar">
                        <div className="text-orange-500 font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind eSIM Myanmar's success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="card text-center group hover:shadow-myanmar">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-500 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-myanmar text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                eSIM Myanmar in Numbers
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Our impact on Myanmar's connectivity landscape
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-lg opacity-90">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-lg opacity-90">Network Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-lg opacity-90">Customer Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-lg opacity-90">Myanmar Coverage</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};