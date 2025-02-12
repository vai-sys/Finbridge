import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./pages/UserLogin";

import UserSignup from "./pages/UserSignUp";
import InvestorDashboard from "./pages/UserDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import { useState ,useEffect} from "react";
import KYC from "./pages/kyc";
import Cookies from 'js-cookie'
import LoanSection from "./pages/LoanSection";
import LandingPage from "./pages/LandingPage";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(Cookies.get("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />

        <Route
          path="/user-dashboard"
          element={
            isAuthenticated === "Investor" ? <InvestorDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated === "Admin" ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/kyc"
          element={
            isAuthenticated !== null ?  <KYC /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/loanapply"
          element={
            isAuthenticated !== null ?  <LoanSection /> : <Navigate to="/login" />
          }
        />
        <Route
        path="/landing"
        element={
          <LandingPage />
        }/>
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </Router>
  );
};


export default App;
