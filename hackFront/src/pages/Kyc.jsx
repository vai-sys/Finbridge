import { useState } from "react";
import { ChevronRight, Upload } from "lucide-react";
// import api from '../api';
import axios from "axios";
import api from "../api";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
const KYCForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
    idType: "",
    idNumber: "",
    idExpiry: "",
    bankAccount: "",
    bankName: "",
    userType: "",
    investmentAmount: "",
    riskTolerance: "",
    investmentTerm: "",
    fundSource: "",
    loanAmount: "",
    loanTerm: "",
    employmentStatus: "",
    annualIncome: "",
    incomeSource: "",
    consent: false,
    dataSharing: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the user ID and token from localStorage
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    // Prepare the data to be submitted
    const submitData = {
      userId: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      verificationStatus: "Verified",
    };

    try {
      // Make the API request with the Authorization header
      const response = await axios.post(
        "http://localhost:3000/api/kyc/verify",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            "Content-Type": "application/json", // Optional: Ensure JSON content type
          },
        }
      );
      if (response.status === 200) {
        const role = Cookies.get("role");
        let data = Cookies.get("userData");
        data = JSON.parse(data);
        data.data.user.kycVerified = true;
        Cookies.set("userData",JSON.stringify(data));
        switch (role) {

          case "Admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/user-dashboard");
        }
      }
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth*
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender*
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Identity Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  ID Type
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select ID Type</option>
                  <option value="passport">Passport</option>
                  <option value="driverLicense">Driver's License</option>
                  <option value="nationalId">National ID</option>
                </select>
              </div>
              <div className="border-2 border-dashed p-4 rounded text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Upload ID Document (JPEG, PNG, PDF)
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Bank Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose Your Role</h2>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="investor"
                    checked={formData.userType === "investor"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Investor</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="borrower"
                    checked={formData.userType === "borrower"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Borrower</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 5:
        return formData.userType === "investor" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Investment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Investment Amount
                </label>
                <input
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Risk Tolerance
                </label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Risk Tolerance</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Investment Term
                </label>
                <select
                  name="investmentTerm"
                  value={formData.investmentTerm}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Term</option>
                  <option value="1">1 year</option>
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Loan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loan Amount Desired
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="selfEmployed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Annual Income
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Consent and Declaration</h2>
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">
                  I agree to the platform's terms and conditions
                </span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={formData.dataSharing}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">
                  I consent to share the provided information with financial
                  institutions
                </span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepNumber
                    ? "bg-blue-500 text-white"
                    : step > stepNumber
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;
