import React, { useState, useEffect } from "react";
import {
  Filter,
  TrendingUp,
  ArrowUpRight,
  X,
  Info,
  ChevronRight,
  Wallet,
  ChevronLeft,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
const InvestmentPage = () => {
  const SortOption = ({ active, label, value, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full transition-all
        ${
          active
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-700 border hover:bg-gray-50"
        }`}
    >
      <TrendingUp size={16} />
      {label}
    </button>
  );
  // Mock data for testing
  const mockLoans = [
    {
      _id: "1",
      title: "Small Business Expansion",
      description:
        "Looking to expand our local restaurant with new equipment and hiring staff.",
      category: "business",
      amount: 500000,
      interestRate: 12.5,
      termLength: 24,
      percentFunded: 45,
    },
    {
      _id: "2",
      title: "Higher Education Loan",
      description: "Need funding for Masters degree in Computer Science.",
      category: "personal",
      amount: 300000,
      interestRate: 10.5,
      termLength: 36,
      percentFunded: 60,
    },
    {
      _id: "3",
      title: "Tech Startup Funding",
      description: "Seed funding for AI-based healthcare startup.",
      category: "business",
      amount: 1000000,
      interestRate: 15.0,
      termLength: 18,
      percentFunded: 30,
    },
    {
      _id: "4",
      title: "Home Renovation",
      description: "Renovating kitchen and bathroom of residential property.",
      category: "personal",
      amount: 250000,
      interestRate: 11.0,
      termLength: 12,
      percentFunded: 75,
    },
    {
      _id: "5",
      title: "E-commerce Inventory",
      description: "Purchase inventory for upcoming festival season.",
      category: "business",
      amount: 750000,
      interestRate: 13.5,
      termLength: 15,
      percentFunded: 55,
    },
    {
      _id: "6",
      title: "Wedding Expenses",
      description: "Personal loan for wedding and related expenses.",
      category: "personal",
      amount: 400000,
      interestRate: 11.5,
      termLength: 24,
      percentFunded: 40,
    },
  ];

  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("interest-desc");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // Simulate API call with mock data
  // useEffect(() => {
  //   const loadMockData = () => {
  //     setTimeout(() => {
  //       setLoans(mockLoans);
  //       setFilteredLoans(mockLoans);
  //       setIsLoading(false);
  //     }, 1000); // Simulate network delay
  //   };
  //   loadMockData();
  // }, []);
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "http://localhost:3000/api/investor/open-loans",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setLoans(response.data);
      setFilteredLoans(response.data);
      console.log(response.data)
    } catch (err) {
      console.log(err.message || "Failed to fetch loans");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let result = [...loans];
    console.log(result);
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((loan) => loan.category === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "interest-desc":
          return b.interestRate - a.interestRate;
        case "interest-asc":
          return a.interestRate - b.interestRate;
        case "amount-desc":
          return b.totalAmountNeeded - a.totalAmountNeeded;
        case "amount-asc":
          return a.totalAmountNeeded - b.totalAmountNeeded;
        default:
          return 0;
      }
    });

    setFilteredLoans(result);
  }, [selectedCategory, sortBy, loans]);

  // Mock investment function
  const handleInvest = async () => {
    // Simulate investment processing
    const payload = {
      "loanId": selectedLoan.loanId._id ,
      "investorId": Cookies.get("userId"),
      "amount": parseFloat(investmentAmount),
    };
    console.log(payload)
    const response = await api.post(
      "investor/fund-loan",
      payload,{withCredentials:true}
    );
    console.log(response);

    setTimeout(() => {
      toast.success(
        `Investment of ₹${investmentAmount} successfully made in ${
          selectedLoan.loanId?.purpose || "this loan"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setShowInvestModal(false);
      setSelectedLoan(null);
      setInvestmentAmount("");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">Investment Opportunities</h1>
        <p className="text-gray-600">
          Discover and invest in verified loan requests
        </p>
      </div>

      {/* Filters and Sorting */}

      <div className="mb-3 space-y-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select
            className="border rounded-lg px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all text-sm">All Categories</option>
            <option value="personal">Personal Loans</option>
            <option value="business">Business Loans</option>
          </select>
        </div>

        <div className="relative ">
          <div
            id="sortScroll"
            className="flex gap-2 text-sm overflow-x-auto py-2 scroll-smooth no-scrollbar"
          >
            <SortOption
              label="Highest Interest"
              value="interest-desc"
              active={sortBy === "interest-desc"}
              onClick={setSortBy}
            />
            <SortOption
              label="Lowest Interest"
              value="interest-asc"
              active={sortBy === "interest-asc"}
              onClick={setSortBy}
            />
            <SortOption
              label="Highest Amount"
              value="amount-desc"
              active={sortBy === "amount-desc"}
              onClick={setSortBy}
            />
            <SortOption
              label="Lowest Amount"
              value="amount-asc"
              active={sortBy === "amount-asc"}
              onClick={setSortBy}
            />
          </div>
        </div>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.map((loan) => (
          <div
            key={loan._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    loan.loanId.purpose === "business"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {/* {loan.category === "business"
                    ? "Business Loan"
                    : "Personal Loan"} */}
                  {loan.loanId.purpose}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {loan.interestRate}% + {2}%
                  </span>
                  <span className="text-sm text-gray-500 font-medium">APR</span>
                </div>
              </div>

              {/* Content Section - Fixed Height */}
              <div className="flex-1 min-h-[200px] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {/* {Test title} */}
                  Loan ID : {loan._id.slice(0,4)}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {/* {loan.notifications.message} */}
                  {`Deadline: ${new Date(loan.fundingDeadline).toLocaleDateString('en-GB')}`}
                </p>

                {/* Details Section */}
                <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Loan Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₹{loan.totalAmountNeeded.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Term Length</span>
                    <span className="font-semibold text-gray-900">
                      {loan.loanId.term} months
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Funded</span>
                      <span className="font-semibold text-gray-900">
                        {Math.floor(100 - ((100*(loan.totalAmountNeeded-loan.totalAmountAllocated))/loan.totalAmountNeeded))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.floor(100 - ((100*(loan.totalAmountNeeded-loan.totalAmountAllocated))/loan.totalAmountNeeded))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Section */}
              <button
                onClick={() => {
                  setSelectedLoan(loan);
                  setShowInvestModal(true);
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                Invest Now
                <ArrowUpRight
                  size={18}
                  className="transform transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {showInvestModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in-0 zoom-in-95">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLoan.loanId.purpose}
                  {/* Title here */}
                </h2>
                <button
                  onClick={() => {
                    setShowInvestModal(false);
                    setSelectedLoan(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Loan Details */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {/* <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Info size={20} className="text-blue-500" />
                    Loan Details
                  </h3> */}
                  <div className="grid gap-3 text-gray-600">
                    <p className="flex items-center gap-2">
                      {/* <span className="font-medium text-gray-700">
                        Category:
                      </span>{" "} */}
                      {/* {selectedLoan.loanId.purpose} */}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Interest Rate:
                      </span>{" "}
                      <span className="text-green-600 font-medium">
                        {selectedLoan.interestRate}% APR
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Amount:</span>{" "}
                      ₹{selectedLoan.totalAmountNeeded.toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Term Length:
                      </span>{" "}
                      {selectedLoan.loanId.term} months
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Purpose:
                      </span>{" "}
                      {/* {selectedLoan.description} */}
                    </p>
                    {1 && (
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="font-semibold mb-3 text-blue-900">
                          Expected Returns
                        </h4>
                        <p className="text-2xl font-bold text-blue-700">
                          ₹
                          {(
                            parseFloat(investmentAmount) *
                            (selectedLoan.interestRate / 100)
                          ).toFixed(2)}{" "}
                          <span className="text-base font-normal text-blue-600">
                            per year
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Investment Form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={1000}
                    max={selectedLoan.amount}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter amount"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Minimum investment: ₹1,000
                  </p>
                </div>

                {/* Expected Returns Calculator */}

                <button
                  onClick={() => setShowConfirmationModal(true)}
                  disabled={
                    !investmentAmount || parseFloat(investmentAmount) < 1000
                  }
                  className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl animate-in fade-in-0 zoom-in-95 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Your Investment
              </h3>
              <p className="text-gray-600">
                ₹{parseFloat(investmentAmount).toLocaleString()} will be
                deducted from your wallet
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  handleInvest();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPage;
