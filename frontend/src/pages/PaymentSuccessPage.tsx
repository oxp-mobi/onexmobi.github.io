import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Download, Mail, Smartphone, ArrowRight, QrCode, Copy, Check } from 'lucide-react';
import { paymentApi } from '../utils/api';

interface PaymentDetails {
  transaction_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_method: string;
  created_at: string;
}

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    const loadPaymentDetails = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const details = await paymentApi.getPaymentStatus(transactionId);
        setPaymentDetails(details);
      } catch (error) {
        console.error('Failed to load payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentDetails();
  }, [transactionId]);

  const copyTransactionId = async () => {
    if (transactionId) {
      try {
        await navigator.clipboard.writeText(transactionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy transaction ID:', error);
      }
    }
  };

  const mockESIMDetails = {
    iccid: '8995140123456789012',
    activationCode: 'LPA:1$rsp-prod.esim.com.mm$eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    qrCode: 'https://i.ibb.co/xtnDfgZy/esim.jpg'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!transactionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment Link</h1>
          <p className="text-gray-600 mb-8">No transaction ID provided</p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - eSIM Myanmar</title>
        <meta name="description" content="Your eSIM purchase was successful. Download your eSIM and start connecting immediately." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your eSIM has been successfully provisioned and is ready to use. 
                Check your email for activation instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Details */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Transaction ID</span>
                    <div className="flex items-center">
                      <span className="font-mono text-sm mr-2">{transactionId}</span>
                      <button
                        onClick={copyTransactionId}
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                        title="Copy Transaction ID"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {paymentDetails && (
                    <>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          paymentDetails.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {paymentDetails.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-MM', {
                            style: 'currency',
                            currency: paymentDetails.currency
                          }).format(paymentDetails.amount)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Payment Method</span>
                        <span>{paymentDetails.payment_method}</span>
                      </div>
                      
                      <div className="flex justify-between py-3">
                        <span className="text-gray-600">Date</span>
                        <span>{new Date(paymentDetails.created_at).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Download Receipt */}
                <div className="mt-6 pt-6 border-t">
                  <button className="w-full btn-secondary flex items-center justify-center">
                    <Download className="h-5 w-5 mr-2" />
                    Download Receipt
                  </button>
                </div>
              </div>

              {/* eSIM Details */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your eSIM Details
                </h2>
                
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                      <img 
                        src={mockESIMDetails.qrCode} 
                        alt="eSIM Activation QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Scan this QR code with your device to install eSIM
                    </p>
                  </div>

                  {/* eSIM Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ICCID
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                        {mockESIMDetails.iccid}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activation Code
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs break-all">
                        {mockESIMDetails.activationCode}
                      </div>
                    </div>
                  </div>

                  {/* Download QR Button */}
                  <button className="w-full btn-primary flex items-center justify-center">
                    <QrCode className="h-5 w-5 mr-2" />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* Activation Instructions */}
            <div className="card mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                How to Activate Your eSIM
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Scan QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Open your camera app and scan the QR code above, or go to Settings > Cellular > Add Cellular Plan
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Install eSIM</h3>
                  <p className="text-sm text-gray-600">
                    Follow the on-screen instructions to install your eSIM profile on your device
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Start Using</h3>
                  <p className="text-sm text-gray-600">
                    Your eSIM is now active! Enable it in your cellular settings and start browsing
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="card mt-8 bg-blue-50 border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                📧 Important Information
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li>• Your eSIM activation details have been sent to your email address</li>
                <li>• Keep your transaction ID for future reference and support</li>
                <li>• eSIM activation typically takes 2-5 minutes after installation</li>
                <li>• Contact our support team if you experience any issues</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="text-center mt-12 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/contact" className="btn-secondary inline-flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Need Help?
              </Link>
              <Link to="/" className="btn-primary inline-flex items-center">
                <ArrowRight className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};