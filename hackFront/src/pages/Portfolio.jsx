import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Users, PiggyBank } from 'lucide-react';
import Cookies from "js-cookie";

const PortfolioOverview = () => {
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

  // Calculate total investment from stats
  const totalInvestment = portfolioData?.stats?.totalInvestment || 0;
  
  // Calculate total returns using avgInterestRate from stats
  const totalReturns = portfolioData?.stats?.totalReturnsEarned || 
    (totalInvestment * (portfolioData?.stats?.avgInterestRate / 100));

  // Calculate number of active loans
  const activeLoansCount = portfolioData?.activeLoans?.filter(loan => 
    loan.status === 'approved' || loan.status === 'disbursed'
  ).length || 0;

  // Get average interest rate from stats
  const avgInterestRate = portfolioData?.stats?.avgInterestRate || 0;

  // Prepare monthly returns data
  const monthlyReturns = portfolioData?.loanDetails?.map(loan => ({
    month: new Date().toLocaleString('default', { month: 'short' }),
    returns: loan.loanAmount * (loan.interestRate / 100) / 12
  })) || [];

  // Calculate investment distribution
  const investmentDistribution = portfolioData?.loanDetails?.reduce((acc, loan) => {
    const purpose = loan.purpose.charAt(0).toUpperCase() + loan.purpose.slice(1);
    const existingPurpose = acc.find(item => item.name === purpose);
    
    if (existingPurpose) {
      existingPurpose.value += (loan.loanAmount / totalInvestment) * 100;
    } else {
      acc.push({
        name: purpose,
        value: (loan.loanAmount / totalInvestment) * 100
      });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReturns)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoansCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <PiggyBank className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Interest Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgInterestRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Returns</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="returns" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Returns"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Investment Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name} ${value.toFixed(0)}%`}
                >
                  {investmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Investments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Loan ID</th>
                  <th className="p-4 font-semibold text-gray-600">Amount</th>
                  <th className="p-4 font-semibold text-gray-600">Interest Rate</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {portfolioData?.activeLoans
                  ?.filter(loan => loan.status === 'approved' || loan.status === 'disbursed')
                  ?.slice(0, 5)
                  ?.map(loan => (
                    <tr key={loan._id}>
                      <td className="p-4">{loan._id.slice(-6)}</td>
                      <td className="p-4">{formatCurrency(loan.loanAmount)}</td>
                      <td className="p-4">{loan.interestRate}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 ${
                          loan.status === 'disbursed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        } rounded-full text-sm`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;