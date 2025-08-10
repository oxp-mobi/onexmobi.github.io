import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import { seoConfigs, generateSEOTags, formatCurrency, getPaymentMethodIcon, getPaymentMethodName } from '../utils/seo';
import { paymentApi } from '../utils/api';

const paymentSchema = z.object({
  paymentMethod: z.enum(['MPU', 'VISA_MASTERCARD', 'UPI', 'UABPAY', 'MMQR']),
  esimPlanId: z.string().min(1, 'Please select an eSIM plan'),
  customerEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  customerPhone: z.string().optional().or(z.literal('')),
  mpuCard: z.object({
    cardNumber: z.string().min(16, 'Card number must be at least 16 digits'),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid month'),
    expiryYear: z.string().regex(/^\d{2}$/, 'Invalid year'),
    cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
    cardholderName: z.string().min(2, 'Cardholder name is required')
  }).optional(),
  mmqrData: z.object({
    phoneNumber: z.string().optional()
  }).optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

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

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<eSIMPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<eSIMPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const seoTags = generateSEOTags(seoConfigs.payment);
  const preselectedPlan = searchParams.get('plan');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      paymentMethod: 'MPU',
      customerEmail: '',
      customerPhone: '',
      esimPlanId: preselectedPlan || ''
    }
  });

  const watchedPaymentMethod = watch('paymentMethod');
  const watchedPlanId = watch('esimPlanId');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await paymentApi.getPlans();
        setPlans(plansData);
        
        // Set preselected plan if available
        if (preselectedPlan) {
          const plan = plansData.find((p: eSIMPlan) => p.id === preselectedPlan);
          if (plan) {
            setSelectedPlan(plan);
            setValue('esimPlanId', plan.id);
          }
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
      }
    };

    loadPlans();
  }, [preselectedPlan, setValue]);

  useEffect(() => {
    if (watchedPlanId) {
      const plan = plans.find(p => p.id === watchedPlanId);
      setSelectedPlan(plan || null);
    }
  }, [watchedPlanId, plans]);

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const paymentPayload = {
        payment_method: data.paymentMethod,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        esim_plan_id: data.esimPlanId,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        mpu_card: data.paymentMethod === 'MPU' ? data.mpuCard : undefined,
        mmqr_data: data.paymentMethod === 'MMQR' ? data.mmqrData : undefined
      };

      const response = await paymentApi.createPayment(paymentPayload);

      if (response.success) {
        setPaymentStatus('success');
        
        // Handle different payment method responses
        switch (data.paymentMethod) {
          case 'MMQR':
            if (response.qr_code_url) {
              setQrCodeUrl(response.qr_code_url);
              startPaymentStatusPolling(response.transaction_id);
            }
            break;
          
          case 'UABPAY':
            if (response.redirect_url) {
              window.location.href = response.redirect_url;
              return;
            }
            break;
          
          default:
            // For card payments or completed payments
            setTimeout(() => {
              navigate(`/payment/success?transaction_id=${response.transaction_id}`);
            }, 2000);
            break;
        }
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startPaymentStatusPolling = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await paymentApi.getPaymentStatus(transactionId);
        
        if (statusResponse.status === 'COMPLETED') {
          clearInterval(pollInterval);
          navigate(`/payment/success?transaction_id=${transactionId}`);
        } else if (statusResponse.status === 'FAILED' || statusResponse.status === 'CANCELLED') {
          clearInterval(pollInterval);
          setPaymentStatus('error');
          setErrorMessage('Payment was not completed successfully');
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 3000);

    // Clear polling after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const paymentMethods = [
    { value: 'MPU', label: 'MPU Card', icon: '💳' },
    { value: 'MMQR', label: 'Myanmar QR', icon: '📱' },
    { value: 'UABPAY', label: 'UABPay', icon: '🏦' },
    { value: 'VISA_MASTERCARD', label: 'Visa/Mastercard', icon: '💳' },
    { value: 'UPI', label: 'UPI', icon: '📲' }
  ];

  return (
    <>
      <Helmet {...seoTags} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Complete Your eSIM Purchase
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Secure payment powered by Transactease Payment Gateway with multiple Myanmar payment options
              </p>
            </div>

            {paymentStatus === 'success' && watchedPaymentMethod === 'MMQR' && qrCodeUrl ? (
              // MMQR QR Code Display
              <div className="payment-form text-center">
                <div className="mb-8">
                  <QrCode className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Scan QR Code to Pay
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Use your mobile banking app to scan this QR code and complete your payment
                  </p>
                </div>

                <div className="qr-code-container mb-8">
                  <img 
                    src={qrCodeUrl} 
                    alt="Payment QR Code" 
                    className="mx-auto max-w-sm w-full"
                  />
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  <p>QR code expires in 10 minutes</p>
                  <p>You will be redirected automatically once payment is confirmed</p>
                </div>

                <div className="flex justify-center">
                  <div className="spinner mr-3"></div>
                  <span className="text-gray-600">Waiting for payment confirmation...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Payment Form */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Plan Selection */}
                    <div className="payment-step">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        1. Select Your eSIM Plan
                      </h2>
                      
                      <Controller
                        name="esimPlanId"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-4">
                            {plans.map((plan) => (
                              <label
                                key={plan.id}
                                className={`block cursor-pointer ${
                                  field.value === plan.id 
                                    ? 'payment-method-card selected' 
                                    : 'payment-method-card'
                                }`}
                              >
                                <input
                                  type="radio"
                                  {...field}
                                  value={plan.id}
                                  className="sr-only"
                                />
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                                    <p className="text-gray-600 text-sm">{plan.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                      <span>📶 {plan.data_allowance}</span>
                                      <span>⏰ {plan.validity}</span>
                                      <span>🌍 Myanmar</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-500">
                                      {formatCurrency(plan.price, plan.currency)}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                      {errors.esimPlanId && (
                        <p className="form-error">{errors.esimPlanId.message}</p>
                      )}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="payment-step">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        2. Choose Payment Method
                      </h2>
                      
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {paymentMethods.map((method) => (
                              <label
                                key={method.value}
                                className={`payment-method-card ${
                                  field.value === method.value ? 'selected' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  {...field}
                                  value={method.value}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <div className="text-2xl mb-2">{method.icon}</div>
                                  <div className="font-medium text-sm">{method.label}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    {/* MPU Card Details */}
                    {watchedPaymentMethod === 'MPU' && (
                      <div className="payment-step">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          3. Enter Card Details
                        </h2>
                        
                        <div className="space-y-4">
                          <Controller
                            name="mpuCard.cardNumber"
                            control={control}
                            render={({ field }) => (
                              <div>
                                <label className="form-label">Card Number</label>
                                <input
                                  {...field}
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className={`form-input ${errors.mpuCard?.cardNumber ? 'border-red-500' : ''}`}
                                  maxLength={19}
                                />
                                {errors.mpuCard?.cardNumber && (
                                  <p className="form-error">{errors.mpuCard.cardNumber.message}</p>
                                )}
                              </div>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <Controller
                              name="mpuCard.expiryMonth"
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <label className="form-label">Month</label>
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder="MM"
                                    className="form-input"
                                    maxLength={2}
                                  />
                                </div>
                              )}
                            />
                            
                            <Controller
                              name="mpuCard.expiryYear"
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <label className="form-label">Year</label>
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder="YY"
                                    className="form-input"
                                    maxLength={2}
                                  />
                                </div>
                              )}
                            />
                            
                            <Controller
                              name="mpuCard.cvv"
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <label className="form-label">CVV</label>
                                  <input
                                    {...field}
                                    type="password"
                                    placeholder="123"
                                    className="form-input"
                                    maxLength={3}
                                  />
                                </div>
                              )}
                            />
                          </div>

                          <Controller
                            name="mpuCard.cardholderName"
                            control={control}
                            render={({ field }) => (
                              <div>
                                <label className="form-label">Cardholder Name</label>
                                <input
                                  {...field}
                                  type="text"
                                  placeholder="John Doe"
                                  className="form-input"
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Customer Information */}
                    <div className="payment-step">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {watchedPaymentMethod === 'MPU' ? '4' : '3'}. Contact Information (Optional)
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name="customerEmail"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <label className="form-label">Email Address</label>
                              <input
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                className="form-input"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                We'll send your eSIM activation details here
                              </p>
                            </div>
                          )}
                        />

                        <Controller
                          name="customerPhone"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <label className="form-label">Phone Number</label>
                              <input
                                {...field}
                                type="tel"
                                placeholder="+95 9 123 456 789"
                                className="form-input"
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <div className="payment-summary">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Order Summary
                        </h3>
                        
                        {selectedPlan ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{selectedPlan.name}</h4>
                                <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                                <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                                  <span>📶 {selectedPlan.data_allowance}</span>
                                  <span>⏰ {selectedPlan.validity}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center font-semibold text-lg">
                                <span>Total</span>
                                <span className="text-orange-500">
                                  {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                                </span>
                              </div>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-start">
                                <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-blue-900 mb-1">
                                    Secure Payment
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    Your payment is protected by bank-grade security and encryption.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Error Message */}
                            {paymentStatus === 'error' && errorMessage && (
                              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium text-red-900 mb-1">
                                      Payment Failed
                                    </h4>
                                    <p className="text-sm text-red-700">
                                      {errorMessage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Pay Button */}
                            <button
                              type="submit"
                              disabled={!isValid || isProcessing}
                              className={`w-full btn-primary mt-6 ${
                                (!isValid || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isProcessing ? (
                                <>
                                  <div className="spinner mr-3"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="h-5 w-5 mr-2" />
                                  Pay {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <p className="text-gray-500">Please select an eSIM plan</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};