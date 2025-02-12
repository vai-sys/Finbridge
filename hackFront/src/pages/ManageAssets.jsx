import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, X, User, Wallet, Calendar, Phone, Mail, MapPin, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      // Assuming there's an API endpoint for freezing/unfreezing accounts
      const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: currentStatus === 'Active' ? 'Pending' : 'Active' }),
      });

      if (response.ok) {
        setUsers(prevUsers =>
          prevUsers.map(user => {
            if (user._id === userId) {
              const newStatus = user.profileStatus === 'Active' ? 'Pending' : 'Active';
              setToastMessage(`User account ${newStatus === 'Pending' ? 'frozen' : 'activated'} successfully`);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              return { ...user, profileStatus: newStatus };
            }
            return user;
          })
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setToastMessage('Error updating user status');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const Toast = () => (
    <div className={`fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 flex items-center gap-2 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
      <AlertCircle size={20} />
      {toastMessage}
    </div>
  );

  const UserDetailModal = ({ user, onClose }) => {
    const transactionData = user.wallet.transactions.map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      amount: t.amount
    }));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">User Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} /> Personal Information
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><User size={16} /> {user.name}</p>
                  <p className="flex items-center gap-2"><Mail size={16} /> {user.email}</p>
                  <p className="flex items-center gap-2"><Phone size={16} /> {user.contactNumber}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} /> 
                    {`${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}`}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wallet size={20} /> Financial Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-lg font-semibold">₹{user.wallet.balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Invested</p>
                    <p className="text-lg font-semibold">₹{user.wallet.totalInvested.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Borrowed</p>
                    <p className="text-lg font-semibold">₹{user.wallet.totalBorrowed.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Interest Earned</p>
                    <p className="text-lg font-semibold">₹{user.wallet.totalInterestEarned.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} /> Transaction History
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#4F46E5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {user.wallet.transactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium">{transaction.type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        transaction.type.includes('deposit') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type.includes('deposit') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        ₹{transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <User size={20} /> {user.name}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <Mail size={16} /> {user.email}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-sm ${
            user.profileStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.profileStatus}
          </span>
          <span className="mt-2 text-sm text-gray-500">{user.roles.join(', ')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Wallet size={16} /> Balance
          </p>
          <p className="font-medium">₹{user.wallet.balance.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <TrendingUp size={16} /> Total Invested
          </p>
          <p className="font-medium">₹{user.wallet.totalInvested.toLocaleString()}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleStatusChange(user._id, user.profileStatus)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              user.profileStatus === 'Active'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            } transition-colors`}
          >
            <AlertCircle size={16} />
            {user.profileStatus === 'Active' ? 'Freeze Account' : 'Activate Account'}
          </button>
          <button 
            onClick={() => setSelectedUser(user)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.roles.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast />
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Investor">Investor</option>
              <option value="Borrower">Borrower</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;