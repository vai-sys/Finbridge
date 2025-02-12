import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const LoanManagement = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanCategory: "personal",
    term: "12",
    purpose: "education",
    panNumber: "",
    guarantor: {
      name: "",
      contactNumber: "",
      relationship: "",
    },
    disbursement: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
  });
  const [files, setFiles] = useState({
    idProof: null,
    bankStatement: null,
    itr: null,
    utilityBill: null,
    businessLicense: null,
    businessContinuationProof: null,
  });
  const [creditScore, setCreditScore] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: uploadedFiles[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "object") {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formDataToSend.append(`${key}[${subKey}]`, subValue);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formDataToSend.append(key, file);
      });

      const response = await axios.post(
        "http://localhost:3000/api/loan/apply",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      setCreditScore(response.data.creditScore);
      window.location.reload();
      // await fetchLoans();
      // setActiveTab("status");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit loan application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Loan Management
          </h1>
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("apply")}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                activeTab === "apply"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Apply for Loan
            </button>

          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "apply" ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Loan Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please fill in the basic loan information
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Amount
                    </label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Category
                    </label>
                    <select
                      name="loanCategory"
                      value={formData.loanCategory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Term (Months)
                    </label>
                    <select
                      name="term"
                      value={formData.term}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {[12, 24, 36, 48, 60].map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Purpose
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="education">Education</option>
                      <option value="medical">Medical</option>
                      <option value="business">Business</option>
                      <option value="home improvement">Home Improvement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Increase Stakes
                    </label>
                    <input
                      type="text"
                      name="bidHigh"
                      // value={formData.bidHigh}
                      onChange={handleInputChange}
                      // pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      // defaultValue={0}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Required Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please upload all required documents in PDF or image format
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(files).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                name={key}
                                onChange={handleFileChange}
                                className="sr-only"
                                accept=".jpg,.jpeg,.png,.pdf"
                                required
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Guarantor Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Information about your loan guarantor
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="guarantor.name"
                      value={formData.guarantor.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="guarantor.contactNumber"
                      value={formData.guarantor.contactNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="guarantor.relationship"
                      value={formData.guarantor.relationship}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Bank Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your bank account information for loan disbursement
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="disbursement.accountNumber"
                      value={formData.disbursement.accountNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="disbursement.bankName"
                      value={formData.disbursement.bankName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="disbursement.ifscCode"
                      value={formData.disbursement.ifscCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Amount
                      </span>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(loan.loanAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status
                      </span>
                      <p className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : loan.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : loan.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Interest Rate
                      </span>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.interestRate}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Term
                      </span>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {loan.term} months
                      </p>
                    </div>
                  </div>
                </div>

                {loan.repaymentSchedule &&
                  loan.repaymentSchedule.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Repayment Schedule
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Installment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {loan.repaymentSchedule.map((payment, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  #{payment.installmentNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    payment.dueDate
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${
                                      payment.status === "paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {loan.notifications && loan.notifications.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Notifications
                    </h4>
                    <div className="space-y-3">
                      {loan.notifications.map((notification, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            notification.read
                              ? "bg-gray-50"
                              : "bg-blue-50 border-l-4 border-blue-400"
                          }`}
                        >
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(notification.sentAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loan.auditTrail && loan.auditTrail.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Audit Trail
                    </h4>
                    <div className="space-y-2">
                      {loan.auditTrail.map((audit, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm text-gray-500"
                        >
                          <span className="w-4 h-4 rounded-full bg-gray-200"></span>
                          <span className="font-medium">{audit.action}</span>
                          <span>•</span>
                          <span>
                            {new Date(audit.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {creditScore && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-6 max-w-sm border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Your Credit Score
            </h4>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                  creditScore >= 750
                    ? "bg-green-500"
                    : creditScore >= 650
                    ? "bg-blue-500"
                    : creditScore >= 550
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${(creditScore / 850) * 100}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                {creditScore}
              </span>
              <span className="text-sm text-gray-500">Maximum: 850</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanManagement;
