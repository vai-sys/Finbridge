import React from "react";
import {
  LogOut,
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Wallet,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
const UserProfile = () => {
  const navigate = useNavigate();

  const getUserData = () => {
    try {
      const rawData = Cookies.get("userData");
      if (!rawData) return null;

      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
 
      return parsedData?.data?.user;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("userId");
    Cookies.remove("userData");

    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">
            No user data found. Please login again.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>

        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Basic Info */}
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">
                  Member since {formatDate(user.createdAt)}
                </p>
                <div className="mt-2 flex items-center">
                  {!user.kycVerified ? (
                    <button
                      onClick={() => {
                        navigate("/kyc");
                      }}
                      className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                    >
                      Verify KYC
                    </button>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.kycVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.kycVerified ? "KYC Verified" : "KYC Pending"}
                    </span>
                  )}
                  <span className="ml-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {user.roles.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wallet className="mr-2" size={20} />
              Financial Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Wallet Balance</p>
                <p className="text-xl font-bold">
                  ₹{user.wallet.balance.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Invested</p>
                <p className="text-xl font-bold">
                  ₹{user.wallet.totalInvested.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Borrowed</p>
                <p className="text-xl font-bold">
                  ₹{user.wallet.totalBorrowed.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Interest Earned</p>
                <p className="text-xl font-bold">
                  ₹{user.wallet.totalInterestEarned.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Interest Paid</p>
                <p className="text-xl font-bold">
                  ₹{user.wallet.totalInterestPaid.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="mr-2" size={20} />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="mr-2 text-gray-400" size={20} />
                <p>{user.email}</p>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 text-gray-400" size={20} />
                <p>{user.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{user.address.street}</p>
              <p>
                {user.address.city}, {user.address.state}{" "}
                {user.address.postalCode}
              </p>
              <p>{user.address.country}</p>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2" size={20} />
            Profile Status
          </h3>
          <div
            className={`p-4 rounded-lg ${
              user.profileStatus === "Pending" ? "bg-yellow-50" : "bg-green-50"
            }`}
          >
            <p
              className={`text-lg ${
                user.profileStatus === "Pending"
                  ? "text-yellow-800"
                  : "text-green-800"
              }`}
            >
              Status: {user.profileStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
