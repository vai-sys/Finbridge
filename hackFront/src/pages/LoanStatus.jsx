import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Cookies from "js-cookie";

const LoanStatus = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const userId = Cookies.get('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await fetch(`http://localhost:3000/api/${userId}/portfolio`);
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }

        const data = await response.json();
        setPortfolioData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!portfolioData) {
    return <div className="p-6">No data available</div>;
  }

  const loans = portfolioData.loanDetails.map(loan => ({
    loanId: loan.loanId,
    totalAmountNeeded: loan.loanAmount,
    totalAmountAllocated: loan.totalAmountAllocated || 0,
    interestRate: loan.interestRate,
    fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: loan.status,
    fundingProgress: ((loan.totalAmountAllocated || 0) / loan.loanAmount) * 100
  }));

  // Calculate stats
  const totalActiveLoans = loans.length;
  const totalPendingAmount = loans.reduce((sum, loan) => 
    sum + (loan.totalAmountNeeded - loan.totalAmountAllocated), 0);
  const totalFundedAmount = loans.reduce((sum, loan) => 
    sum + loan.totalAmountAllocated, 0);

  const statusColors = {
    'open': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'disbursed': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'open':
        return <Clock className="w-4 h-4" />;
      case 'approved':
      case 'disbursed':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Prepare data for the line chart - using cumulative funding over loans
  const lineChartData = loans.reduce((acc, loan) => {
    const month = new Date().toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.date === month);
    if (existingMonth) {
      existingMonth.amount += loan.totalAmountAllocated;
    } else {
      acc.push({
        date: month,
        amount: loan.totalAmountAllocated
      });
    }
    return acc;
  }, []);

  // Prepare data for the pie chart
  const statusCounts = loans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Loan Status Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and manage your loan applications</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{totalActiveLoans}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPendingAmount)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Funded Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFundedAmount)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loan Status Table */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Active Loans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Loan ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Required Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Allocated</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Interest Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td className="px-6 py-4">
                      <span className="font-medium">{loan.loanId.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(loan.totalAmountNeeded)}</td>
                    <td className="px-6 py-4">{formatCurrency(loan.totalAmountAllocated)}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${loan.fundingProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 mt-1">{loan.fundingProgress.toFixed(1)}%</span>
                    </td>
                    <td className="px-6 py-4">{loan.interestRate}%</td>
                    <td className="px-6 py-4">{new Date(loan.fundingDeadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusColors[loan.status]}`}>
                        {getStatusIcon(loan.status)}
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Funding Progress Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Allocated Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Loan Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#6b7280'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatus;