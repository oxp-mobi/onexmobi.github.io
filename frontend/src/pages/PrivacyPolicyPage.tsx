import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Mail, Phone } from 'lucide-react';
import { seoConfigs, generateSEOTags } from '../utils/seo';

export const PrivacyPolicyPage: React.FC = () => {
  const seoTags = generateSEOTags(seoConfigs.privacyPolicy);

  return (
    <>
      <Helmet {...seoTags} />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="bg-gradient-myanmar text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl opacity-90">
                How we collect, use, and protect your personal information
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700">
                  At eSIM Myanmar ("we," "our," or "us"), we are committed to protecting your privacy and 
                  personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                  your information when you use our eSIM services and website at esim.com.mm.
                </p>
                <p className="text-gray-700">
                  We comply with applicable data protection laws, including the General Data Protection 
                  Regulation (GDPR) and Myanmar's Personal Data Protection Act (PDPA), ensuring your 
                  rights are protected.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Payment information (processed securely through Transactease)</li>
                  <li>Device information (IMEI, device model, operating system)</li>
                  <li>Location data (for service provisioning and network optimization)</li>
                  <li>Usage data (data consumption, connection logs)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>IP addresses and network identifiers</li>
                  <li>Browser type and version</li>
                  <li>Website usage analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use your personal information for the following purposes:</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Provision</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Provision and activate eSIM services</li>
                  <li>Process payments and billing</li>
                  <li>Provide customer support</li>
                  <li>Send service-related notifications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Operations</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Improve our services and website</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                  <li>Conduct market research and analytics</li>
                </ul>
              </div>

              {/* Legal Basis */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Basis for Processing</h2>
                <p className="text-gray-700 mb-4">
                  Under GDPR, we process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Contract Performance:</strong> To fulfill our eSIM service agreements</li>
                  <li><strong>Legitimate Interest:</strong> For business operations and service improvement</li>
                  <li><strong>Legal Compliance:</strong> To meet regulatory and legal requirements</li>
                  <li><strong>Consent:</strong> For marketing communications (where applicable)</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell or rent your personal information. We may share your information with:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Payment processors (Transactease Payment Gateway)</li>
                  <li>Network operators and telecommunications partners</li>
                  <li>Cloud hosting providers (Google Cloud Platform)</li>
                  <li>Customer support platforms</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Government authorities when required by law</li>
                  <li>Law enforcement agencies for criminal investigations</li>
                  <li>Regulatory bodies for compliance purposes</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement comprehensive security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure cloud infrastructure with Google Cloud Platform</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and employee training</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
                <p className="text-gray-700 mb-4">
                  Under GDPR and PDPA, you have the following rights regarding your personal data:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Access & Portability</h4>
                    <p className="text-sm text-gray-700">
                      Request access to your personal data and receive it in a portable format
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Correction</h4>
                    <p className="text-sm text-gray-700">
                      Request correction of inaccurate or incomplete personal data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                    <p className="text-sm text-gray-700">
                      Request deletion of your personal data under certain circumstances
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Objection</h4>
                    <p className="text-sm text-gray-700">
                      Object to processing of your personal data for direct marketing
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our services 
                  and comply with legal obligations:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Account data: For the duration of your service plus 7 years</li>
                  <li>Transaction records: 10 years as required by financial regulations</li>
                  <li>Usage logs: 2 years for network optimization</li>
                  <li>Marketing data: Until consent is withdrawn</li>
                </ul>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your data may be transferred to and processed in countries outside Myanmar, including:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>United States (Google Cloud Platform services)</li>
                  <li>Singapore (Regional data centers)</li>
                  <li>European Union (Service providers)</li>
                </ul>
                <p className="text-gray-700">
                  We ensure adequate protection through appropriate safeguards such as Standard 
                  Contractual Clauses and adequacy decisions.
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Marketing cookies for personalized content</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookie settings through your browser preferences.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-700">
                  Our services are not intended for children under 16 years of age. We do not 
                  knowingly collect personal information from children under 16. If you believe 
                  we have collected information from a child under 16, please contact us immediately.
                </p>
              </div>

              {/* Updates */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy periodically to reflect changes in our practices 
                  or legal requirements. We will notify you of significant changes through email or 
                  website notifications. The "Last updated" date indicates when the policy was last revised.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-orange-50 p-8 rounded-lg border border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have questions about this Privacy Policy or want to exercise your privacy rights, 
                  please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-700">privacy@esim.com.mm</p>
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
                    <strong>Data Protection Officer:</strong> For GDPR-related inquiries, 
                    contact our DPO at dpo@esim.com.mm
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