import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Settings, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Shield,
  Key
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';

const configSchema = z.object({
  environment: z.enum(['UAT', 'LIVE']),
  access_key: z.string().min(10, 'Access key must be at least 10 characters'),
  secret_key: z.string().min(20, 'Secret key must be at least 20 characters'),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface PaymentConfig {
  environment: string;
  merchant_user_id: string;
  channel: string;
  access_key_masked: string;
  secret_key_masked: string;
  last_updated: string;
}

export const AdminPaymentConfigPage: React.FC = () => {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    mode: 'onChange'
  });

  const watchedEnvironment = watch('environment');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await adminApi.getPaymentConfig();
        setConfig(data);
        setValue('environment', data.environment as 'UAT' | 'LIVE');
      } catch (error) {
        console.error('Failed to load config:', error);
        setErrorMessage('Failed to load payment configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [setValue]);

  const onSubmit = async (data: ConfigFormData) => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await adminApi.updatePaymentConfig(data);
      
      if (response.success) {
        setSuccessMessage('Payment gateway configuration updated successfully!');
        
        // Reload config to get updated masked values
        const updatedConfig = await adminApi.getPaymentConfig();
        setConfig(updatedConfig);
        
        // Reset form with new environment
        setValue('environment', data.environment);
        setValue('access_key', '');
        setValue('secret_key', '');
        
      } else {
        setErrorMessage(response.message || 'Failed to update configuration');
      }
    } catch (error: any) {
      console.error('Failed to update config:', error);
      setErrorMessage(error.message || 'Failed to update payment configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading configuration...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Gateway Configuration - Admin - eSIM Myanmar</title>
        <meta name="description" content="Configure Transactease payment gateway settings" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-orange-500" />
            Payment Gateway Configuration
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Transactease payment gateway settings and environment configuration
          </p>
        </div>

        {/* Current Configuration Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                config?.environment === 'LIVE' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {config?.environment === 'LIVE' ? '🔴' : '🟡'} {config?.environment}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Merchant ID</h3>
              <p className="text-sm text-gray-600 font-mono">{config?.merchant_user_id}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Channel</h3>
              <p className="text-sm text-gray-600">{config?.channel}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Access Key</h3>
              <p className="text-sm text-gray-600 font-mono">{config?.access_key_masked}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Secret Key</h3>
              <p className="text-sm text-gray-600 font-mono">{config?.secret_key_masked}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
              <p className="text-sm text-gray-600">
                {config?.last_updated ? new Date(config.last_updated).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Update Configuration</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-2" />
              Changes take effect immediately
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Configuration Updated</h3>
                <p className="text-green-700 text-sm mt-1">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Configuration Error</h3>
                <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Environment Selection */}
            <div>
              <label className="form-label">Environment *</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  watchedEnvironment === 'UAT' 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    {...register('environment')}
                    type="radio"
                    value="UAT"
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">UAT Environment</h3>
                      <p className="text-sm text-gray-600">Testing and development</p>
                    </div>
                  </div>
                </label>

                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  watchedEnvironment === 'LIVE' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    {...register('environment')}
                    type="radio"
                    value="LIVE"
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">LIVE Environment</h3>
                      <p className="text-sm text-gray-600">Production transactions</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.environment && (
                <p className="form-error">{errors.environment.message}</p>
              )}
            </div>

            {/* Warning for LIVE environment */}
            {watchedEnvironment === 'LIVE' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Production Environment Warning</h4>
                    <p className="text-red-700 text-sm mt-1">
                      You are configuring the LIVE environment. All transactions will be processed 
                      with real money. Ensure you have the correct production credentials.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Access Key */}
            <div>
              <label className="form-label">Access Key *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('access_key')}
                  type={showAccessKey ? 'text' : 'password'}
                  className={`form-input pl-10 pr-12 font-mono ${errors.access_key ? 'border-red-500' : ''}`}
                  placeholder="Enter new access key"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowAccessKey(!showAccessKey)}
                >
                  {showAccessKey ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.access_key && (
                <p className="form-error">{errors.access_key.message}</p>
              )}
            </div>

            {/* Secret Key */}
            <div>
              <label className="form-label">Secret Key *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('secret_key')}
                  type={showSecretKey ? 'text' : 'password'}
                  className={`form-input pl-10 pr-12 font-mono ${errors.secret_key ? 'border-red-500' : ''}`}
                  placeholder="Enter new secret key"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.secret_key && (
                <p className="form-error">{errors.secret_key.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Secret key must be at least 20 characters long
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-gray-500">
                {isDirty ? 'You have unsaved changes' : 'No changes to save'}
              </div>
              <button
                type="submit"
                disabled={!isDirty || saving}
                className={`btn-primary flex items-center ${
                  (!isDirty || saving) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-blue-500 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Security Guidelines</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Store credentials securely and never share them</li>
                <li>• Test thoroughly in UAT environment before switching to LIVE</li>
                <li>• Monitor transactions closely after configuration changes</li>
                <li>• Keep backup of working configuration before updates</li>
                <li>• All configuration changes are logged for security auditing</li>
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};