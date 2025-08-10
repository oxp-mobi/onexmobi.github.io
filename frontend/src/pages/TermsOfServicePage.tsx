import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Mail, Phone } from 'lucide-react';
import { seoConfigs, generateSEOTags } from '../utils/seo';

export const TermsOfServicePage: React.FC = () => {
  const seoTags = generateSEOTags(seoConfigs.termsOfService);

  return (
    <>
      <Helmet {...seoTags} />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-gradient-myanmar text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-xl opacity-90">
                Terms and conditions for using eSIM Myanmar services
              </p>
              <div className="text-sm opacity-75 mt-4">
                Last updated: January 2025
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-700">
                  By accessing and using eSIM Myanmar's services ("Service") operated by eSIM Myanmar 
                  ("us", "we", or "our"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <p className="text-gray-700">
                  These Terms govern your use of our eSIM services, website (esim.com.mm), 
                  and any related services provided by eSIM Myanmar.
                </p>
              </div>

              {/* Service Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
                <p className="text-gray-700 mb-4">
                  eSIM Myanmar provides embedded SIM (eSIM) services that allow users to connect 
                  to mobile networks in Myanmar without a physical SIM card. Our services include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>eSIM profile provisioning and activation</li>
                  <li>Mobile data connectivity services</li>
                  <li>Customer support and technical assistance</li>
                  <li>Online payment processing</li>
                  <li>Account management portal</li>
                </ul>
              </div>

              {/* Eligibility */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility</h2>
                <p className="text-gray-700 mb-4">
                  To use our services, you must:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Be at least 18 years of age or have parental consent</li>
                  <li>Have a compatible eSIM-enabled device</li>
                  <li>Provide accurate and complete information</li>
                  <li>Have legal capacity to enter into binding agreements</li>
                  <li>Not be prohibited from receiving services under applicable laws</li>
                </ul>
              </div>

              {/* Account Registration */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration and Security</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h3>
                <p className="text-gray-700 mb-4">
                  While account creation is optional for basic purchases, you may create an account 
                  to access additional features. You agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information</li>
                  <li>Keep your account credentials secure</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Security</h3>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account information. 
                  Notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              {/* Service Usage */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Usage and Restrictions</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Acceptable Use</h3>
                <p className="text-gray-700 mb-4">You may use our services only for lawful purposes. You agree not to:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Use the service for illegal activities or to violate any laws</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service to transmit harmful or malicious content</li>
                  <li>Resell or redistribute our services without authorization</li>
                  <li>Use automated systems to access the service</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Network Usage</h3>
                <p className="text-gray-700">
                  Our data services are subject to fair usage policies. Excessive usage that impacts 
                  network performance may result in service limitations or additional charges.
                </p>
              </div>

              {/* Payment Terms */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing and Fees</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>All prices are displayed in Myanmar Kyat (MMK) unless otherwise specified</li>
                  <li>Prices include applicable taxes and fees</li>
                  <li>We reserve the right to change prices with 30 days notice</li>
                  <li>Promotional pricing may have specific terms and expiration dates</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Processing</h3>
                <p className="text-gray-700 mb-4">
                  Payments are processed securely through Transactease Payment Gateway. We accept:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>MPU (Myanmar Payment Union) cards</li>
                  <li>UABPay wallet</li>
                  <li>Myanmar QR (MMQR) payments</li>
                  <li>Visa and Mastercard (international)</li>
                  <li>UPI payments</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Policy</h3>
                <p className="text-gray-700">
                  Refunds are available under the following conditions:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Request made within 24 hours of purchase</li>
                  <li>eSIM has not been activated or used</li>
                  <li>Technical issues preventing service activation</li>
                  <li>Duplicate charges or billing errors</li>
                </ul>
              </div>

              {/* Service Availability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
                <p className="text-gray-700 mb-4">
                  We strive to provide reliable service but cannot guarantee 100% uptime. Service may be 
                  interrupted due to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Scheduled maintenance and updates</li>
                  <li>Network operator maintenance</li>
                  <li>Technical difficulties or system failures</li>
                  <li>Force majeure events (natural disasters, government actions, etc.)</li>
                  <li>Third-party service dependencies</li>
                </ul>
              </div>

              {/* Device Compatibility */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Device Compatibility</h2>
                <p className="text-gray-700 mb-4">
                  Our eSIM services require compatible devices. Supported devices include:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Apple Devices</h4>
                    <p className="text-sm text-gray-700">iPhone XS and newer models, iPad Pro (3rd gen) and newer</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Android Devices</h4>
                    <p className="text-sm text-gray-700">Samsung Galaxy S20+, Google Pixel 3 and newer, select other models</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Device compatibility may vary. Check your device's eSIM support before purchasing. 
                  We are not responsible for incompatibility issues.
                </p>
              </div>

              {/* Privacy and Data */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection and use of personal information 
                  is governed by our Privacy Policy, which forms part of these Terms. Key points include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>We collect only necessary personal information</li>
                  <li>Data is protected with industry-standard security measures</li>
                  <li>We comply with GDPR and Myanmar PDPA requirements</li>
                  <li>You have rights regarding your personal data</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
                <p className="text-gray-700 mb-4">
                  The Service and its original content, features, and functionality are owned by 
                  eSIM Myanmar and are protected by international copyright, trademark, and other 
                  intellectual property laws.
                </p>
                <p className="text-gray-700">
                  You may not copy, modify, distribute, sell, or lease any part of our services 
                  without our express written permission.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by applicable law, eSIM Myanmar shall not be liable for:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, revenue, data, or business opportunities</li>
                  <li>Service interruptions or connectivity issues</li>
                  <li>Third-party actions or network operator limitations</li>
                  <li>Device compatibility or technical issues</li>
                </ul>
                <p className="text-gray-700">
                  Our total liability is limited to the amount paid for the specific service that 
                  gave rise to the claim.
                </p>
              </div>

              {/* Indemnification */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold eSIM Myanmar harmless from any claims, damages, 
                  losses, or expenses arising from your use of the service, violation of these Terms, 
                  or infringement of any third-party rights.
                </p>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">By You</h3>
                <p className="text-gray-700 mb-4">
                  You may stop using our services at any time. Prepaid services will continue 
                  until expiration.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">By Us</h3>
                <p className="text-gray-700">
                  We may terminate or suspend your access for violations of these Terms, illegal 
                  activities, or other serious breaches. We will provide notice when reasonably possible.
                </p>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Jurisdiction</h2>
                <p className="text-gray-700">
                  These Terms are governed by the laws of Myanmar. Any disputes shall be resolved 
                  in the courts of Myanmar, subject to applicable international arbitration agreements.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  material changes via email or website notification. Continued use of the service 
                  after changes constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Severability */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be unenforceable, the remaining 
                  provisions will continue in full force and effect.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-orange-50 p-8 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-700">legal@esim.com.mm</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-700">+95 9 123 456 789</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Business Address:</strong> eSIM Myanmar<br />
                    Yangon, Myanmar<br />
                    Registration: [Company Registration Number]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};