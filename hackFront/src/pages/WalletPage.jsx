import React, { useState } from 'react';
import { 
  Wallet, ArrowUpRight, Clock, CreditCard, Building2, 
  Smartphone, Lock, Bitcoin, ChevronRight, CircleDollarSign,
  Sparkles
} from 'lucide-react';
import Cookies from "js-cookie"
import api from "../api"
import { useEffect } from 'react';
const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedTab, setSelectedTab] = useState('card');
  useEffect( ()=>{
    const getData = async ()=>{
      const response = await api.get(`http://localhost:3000/api/wallet/transactions/${Cookies.get("userId")}`);
      setBalance(response.data.walletBalance);

    }
    getData();
    
  },[])
  const handleAddMoney = async (e) => {
    e.preventDefault();
    try
    {
      const userId = Cookies.get("userId");
      const data = {"userId" : userId,"amount" : amount,"description" : "paisa"};
      console.log(data)
      const response = await api.post("/wallet/deposit",data,{withCredentials:true});
      console.log(response)
      if (amount) {
        setBalance(prev => prev + parseFloat(amount));
        setAmount('');
      }

    }
    catch(err)
    {
      console.log(err)
    }
  };

  const handleQuickAmountClick = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const paymentMethods = [
    { id: 'card', label: 'Card', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'bank', label: 'Bank Transfer', icon: <Building2 className="w-6 h-6" /> },
    { id: 'upi', label: 'UPI', icon: <Smartphone className="w-6 h-6" /> },
    { id: 'netbanking', label: 'Net Banking', icon: <Lock className="w-6 h-6" /> },
    { id: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-6 h-6" /> }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const recentTransactions = [
    { type: 'Investment', amount: -1000, date: '2024-01-18', status: 'Completed' },
    { type: 'Added Money', amount: 2000, date: '2024-01-17', status: 'Completed' },
    { type: 'Interest Earned', amount: 150, date: '2024-01-16', status: 'Completed' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-lg font-medium">Available Balance</p>
              </div>
              <h2 className="text-6xl font-bold mb-4 tracking-tight">${balance.toLocaleString()}</h2>
              <div className="flex items-center text-sm bg-white bg-opacity-10 w-fit px-3 py-2 rounded-full">
                <Clock className="w-4 h-4 mr-2" />
                <span>Last updated: Just now</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full -mb-32 blur-2xl"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                Add Money
                <div className="text-sm font-normal bg-blue-100 text-blue-600 px-3 py-1 rounded-full ml-auto flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Instant Credit
                </div>
              </h3>

              <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-8 items-center">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedTab(method.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200
                      ${selectedTab === method.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:scale-105'}`}
                  >
                    {method.icon}
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddMoney} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Enter Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none text-lg transition-all duration-200"
                    placeholder="$ Enter amount"
                    min="0"
                  />
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => handleQuickAmountClick(quickAmount)}
                        className="px-5 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-gray-600 font-medium transition-all duration-200 hover:scale-105"
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5"
                >
                  Add Money
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-8">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    transaction.amount > 0 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  } transition-colors duration-200`}>
                    <ArrowUpRight className={`w-5 h-5 ${
                      transaction.amount < 0 ? 'transform rotate-180' : ''
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard; 