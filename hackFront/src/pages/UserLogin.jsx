import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from '../api';
import Cookies from 'js-cookie';
import axios from "axios";
const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  // Function to handle role-based redirection
  const handleRoleBasedRedirect = (role) => {
    switch (role) {
      case "Admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/user-dashboard");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form input
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make the login request
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Extract data from the response
      const data = response.data.data;
      console.log(data);
      // Check if login was unsuccessful
      if (response.status !== 200) {
        throw new Error(data.message || "Login failed");
      }

      Cookies.set("token", data.token, { expires: 7, secure: true }); // Expires in 7 days
      Cookies.set("role", data.user.roles[0], { expires: 7, secure: true });
      Cookies.set("userId", data.user._id, { expires: 7, secure: true });

      // Optionally store user data as a JSON string
      Cookies.set("userData", JSON.stringify(response.data), {
        expires: 7,
        secure: true,
      });
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const role = Cookies.get('role');

    if (role) {
      handleRoleBasedRedirect(role);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="relative w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 m-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white/50 backdrop-blur-sm"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?
              <button
                onClick={() => navigate("/signup")}
                className="ml-2 text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
