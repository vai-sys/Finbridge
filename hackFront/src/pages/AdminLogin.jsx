import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  BadgeDollarSign,
  ClipboardList,
  UserCircle,
  MenuIcon,
  LogOut
} from 'lucide-react';
import LoanSection from './LoanSection';
import UserProfile from './UserProfile';
import InvestmentPage from './InvestmentPage';
import WalletPage from './WalletPage';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'loanProposal', label: 'Loan Proposal', icon: <HandHelping size={20} /> },
    { id: 'freezeAssets', label: 'Manage Assets', icon: <ChartCandlestick size={20} /> },
    { id: 'approveLoans', label: 'Approve Loans', icon: <ChartCandlestick size={20} /> },
    { id: 'loanStatus', label: 'Loan Status', icon: <ClipboardList size={20} /> },
    { id: 'profile', label: 'User Profile', icon: <UserCircle size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20}/> }
  ];

  // Placeholder components for each section
  const components = {

    wallet: () => (
      <WalletPage />
    ),
    invest: () => (
     <InvestmentPage />
    ),
    borrow: () => (
      <LoanSection/>
    ),
    loanStatus: () => (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Loan Status</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Loan ID</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Next Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4">L123456</td>
                <td className="p-4">$5,000</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                </td>
                <td className="p-4">Mar 15, 2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    profile: () => (
      <UserProfile/>
    )
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 bg-white border-b">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } lg:block fixed  lg:static w-64 h-full bg-white border-r overflow-y-auto`}
        >
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto mt-10 mb-10">

          {components[activeTab]()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;