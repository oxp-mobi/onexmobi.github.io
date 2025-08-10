import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/api';
import { formatCurrency } from '../../utils/seo';

interface DashboardStats {
  total_payments: number;
  completed_payments: number;
  pending_payments: number;
  failed_payments: number;
  success_rate: number;
}

interface Transaction {
  _id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  customer_email?: string;
}

interface DashboardData {
  statistics: DashboardStats;
  recent_transactions: Transaction[];
  current_environment: string;
}

export const AdminDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await adminApi.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      COMPLETED: 'status-completed',
      PENDING: 'status-pending',
      FAILED: 'status-failed',
      PROCESSING: 'status-processing'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'status-pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = dashboardData?.statistics;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - eSIM Myanmar</title>
        <meta name="description" content="eSIM Myanmar admin dashboard for monitoring payments and system status" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of eSIM Myanmar payment system and performance metrics
          </p>
          
          {/* Environment Badge */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              dashboardData?.current_environment === 'LIVE' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {dashboardData?.current_environment === 'LIVE' ? '🔴' : '🟡'} 
              {dashboardData?.current_environment} Environment
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Total Payments</p>
                <p className="dashboard-stat-number">{stats?.total_payments || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Success Rate</p>
                <p className="dashboard-stat-number">{stats?.success_rate?.toFixed(1) || 0}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+2.1% improvement</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Pending</p>
                <p className="dashboard-stat-number">{stats?.pending_payments || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">-5 from yesterday</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stat-label">Failed</p>
                <p className="dashboard-stat-number">{stats?.failed_payments || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">-8% reduction</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Gateway</h3>
                <p className="text-orange-100 mb-4">Manage payment configurations</p>
                <a href="/admin/payment-config" className="bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-50 transition-colors">
                  Configure
                </a>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">System Status</h3>
                <p className="text-blue-100 mb-4">All systems operational</p>
                <span className="bg-green-500 text-white px-4 py-2 rounded-md font-medium">
                  Healthy
                </span>
              </div>
              <Activity className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
                <p className="text-2xl font-bold mb-2">₹15,240</p>
                <span className="text-green-100">+18% from yesterday</span>
              </div>
              <TrendingUp className="h-12 w-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recent_transactions?.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="font-mono text-sm">{transaction.transaction_id}</td>
                    <td className="font-semibold">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td>
                      <span className="inline-flex items-center">
                        <span className="mr-2">
                          {transaction.payment_method === 'MPU' && '💳'}
                          {transaction.payment_method === 'MMQR' && '📱'}
                          {transaction.payment_method === 'UABPAY' && '🏦'}
                          {transaction.payment_method === 'VISA_MASTERCARD' && '💳'}
                        </span>
                        {transaction.payment_method}
                      </span>
                    </td>
                    <td>
                      <span className={`${getStatusBadge(transaction.status)} flex items-center`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">
                      {transaction.customer_email || 'N/A'}
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Status</h3>
            <div className="space-y-4">
              {[
                { method: 'MPU', status: 'operational', uptime: '99.9%' },
                { method: 'MMQR', status: 'operational', uptime: '99.8%' },
                { method: 'UABPay', status: 'operational', uptime: '99.7%' },
                { method: 'Visa/Mastercard', status: 'operational', uptime: '99.9%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium">{item.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                    <p className="text-xs text-gray-500">{item.uptime} uptime</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Payment gateway configuration updated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New eSIM plan activated</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">System maintenance completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};