import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  BadgeDollarSign,
  ClipboardList,
  UserCircle,
  MenuIcon,
  LogOut,
} from "lucide-react";
import LoanSection from "./LoanSection";
import UserProfile from "./UserProfile";
import InvestmentPage from "./InvestmentPage";
import WalletPage from "./WalletPage";
import PortfolioOverview from "./Portfolio";
import LoanStatus from "./LoanStatus";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };
  const menuItems = [
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "invest", label: "Invest", icon: <Wallet size={20} /> },
    { id: "borrow", label: "Borrow Loan", icon: <BadgeDollarSign size={20} /> },
    {
      id: "loanStatus",
      label: "Loan Status",
      icon: <ClipboardList size={20} />,
    },
    { id: "wallet", label: "Wallet", icon: <Wallet size={20} /> },
    { id: "profile", label: "User Profile", icon: <UserCircle size={20} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={20} /> },
  ];

  // Placeholder components for each section
  const components = {
    portfolio: () => (
      <PortfolioOverview />
    ),
    logout: () => (
      <>
        {!isLogoutDialogOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full mx-4 transform transition-all animate-in slide-in-from-bottom-4 duration-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Confirm Logout
              </h2>
              <p className="mb-8 text-gray-600">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    clearCookies();
                    setIsLogoutDialogOpen(false);
                    window.location.reload(); // Redirect to login or reload page
                  }}
                  className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-red-600 transition-colors duration-200"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => {
                    setIsLogoutDialogOpen(false);
                    window.location.reload();
                  }}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="hidden"
          aria-hidden="true"
        >
          Open Logout Dialog
        </button>
      </>
    ),
    wallet: () => <WalletPage />,
    invest: () => <InvestmentPage />,
    borrow: () => <LoanSection />,
    loanStatus: () => (
      <LoanStatus/>
    ),
    profile: () => <UserProfile />,
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
            isMobileMenuOpen ? "block" : "hidden"
          } lg:block fixed  lg:static w-64 h-full bg-white border-r overflow-y-auto z-50 `}
          
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
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
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
