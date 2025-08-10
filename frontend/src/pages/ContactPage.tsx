import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { seoConfigs, generateSEOTags } from '../utils/seo';
import { paymentApi } from '../utils/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const seoTags = generateSEOTags(seoConfigs.contact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await paymentApi.submitContactForm(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-orange-500" />,
      title: 'Email Us',
      content: 'info@esim.com.mm',
      description: 'Send us an email for detailed inquiries'
    },
    {
      icon: <Phone className="h-6 w-6 text-orange-500" />,
      title: 'Call Us',
      content: '+95 9 123 456 789',
      description: 'Available during business hours'
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      title: 'Visit Us',
      content: 'Yangon, Myanmar',
      description: 'Our headquarters in the heart of Myanmar'
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      description: 'Myanmar Time (MMT)'
    }
  ];

  const faq = [
    {
      question: 'How quickly can I get my eSIM activated?',
      answer: 'Your eSIM will be activated within 5 minutes of successful payment. You\'ll receive an email with the QR code and activation instructions.'
    },
    {
      question: 'Which devices are compatible with eSIM?',
      answer: 'Most modern smartphones support eSIM including iPhone XS and newer, Samsung Galaxy S20 and newer, Google Pixel 3 and newer. Check your device settings for eSIM support.'
    },
    {
      question: 'Can I use my eSIM for tethering/hotspot?',
      answer: 'Yes, you can use your eSIM data for tethering and creating mobile hotspots, subject to your plan\'s data allowance.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept MPU cards, UABPay, MMQR, Visa, Mastercard, and UPI payments for your convenience.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Refunds are available within 24 hours of purchase if the eSIM hasn\'t been activated. Please contact our support team for assistance.'
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
                Contact eSIM Myanmar
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 slide-up">
                We're here to help with all your connectivity needs. Get in touch with our expert team.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <div key={index} className="card text-center group hover:shadow-myanmar">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-900 font-medium mb-2">
                    {info.content}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Have a question about our eSIM services? Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <p className="text-green-700">Thank you! Your message has been sent successfully.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-700">Sorry, there was an error sending your message. Please try again.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Name *</label>
                      <input
                        {...register('name')}
                        type="text"
                        className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="form-error">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Phone (Optional)</label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="form-input"
                        placeholder="+95 9 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="form-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Subject *</label>
                    <input
                      {...register('subject')}
                      type="text"
                      className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
                      placeholder="What can we help you with?"
                    />
                    {errors.subject && (
                      <p className="form-error">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Message *</label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className={`form-input ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Please describe your question or concern in detail..."
                    />
                    {errors.message && (
                      <p className="form-error">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`w-full btn-primary flex items-center justify-center ${
                      (!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mb-8">
                  Find quick answers to common questions about our eSIM services.
                </p>

                <div className="space-y-6">
                  {faq.map((item, index) => (
                    <div key={index} className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Need Immediate Help?
                  </h4>
                  <p className="text-gray-600 mb-4">
                    For urgent technical issues or immediate assistance, please call our support hotline:
                  </p>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-orange-500 mr-2" />
                    <a href="tel:+959123456789" className="text-orange-500 font-semibold hover:text-orange-600">
                      +95 9 123 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't wait! Get your eSIM today and enjoy seamless connectivity in Myanmar.
            </p>
            <a href="/payment" className="btn-primary text-lg px-8 py-4">
              Choose Your eSIM Plan
            </a>
          </div>
        </section>
      </div>
    </>
  );
};