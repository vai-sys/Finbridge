import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const UserSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['Investor'],
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: [role]
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber)) {
      setError('Contact number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault(); // Add this to prevent form submission
    setError('');
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      // await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(formData)
      const response = await axios.post("http://localhost:3000/api/auth/register",formData,  {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      const data = response.data;
      
      // Here you would typically make your API call to register the user
      console.log('Form submitted:', formData);
      
      // Redirect to login page after successful signup
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(
        err.response?.data?.message || "An error occurred during signup. Please try again."
      );
    }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 py-12 px-4">
      <div className="relative w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        
        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 " >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">
              Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'Additional Details'}
            </p>
          </div>

          {/* Changed this to always use handleSubmit for the final step and handleNextStep for first step */}
          <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {currentStep === 1 ? (
              // ... Rest of the Step 1 form fields remain the same
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 characters)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />

                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Role</label>
                  <div className="flex gap-4">
                    {['Borrower', 'Investor'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          formData.roles.includes(role)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>
            ) : (
              // ... Rest of the Step 2 form fields remain the same
              <div className="space-y-4">
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number (10 digits)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />

                <input
                  type="text"
                  name="address.street"
                  placeholder="Street Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    name="address.state"
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.postalCode"
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    name="address.country"
                    placeholder="Country"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                    value={formData.address.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium
                  transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : currentStep === 1 ? (
                  'Next'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?
              <button
                onClick={() => navigate('/login')}
                className="ml-2 text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;