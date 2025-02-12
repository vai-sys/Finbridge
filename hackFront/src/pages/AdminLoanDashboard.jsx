import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee,
  Clock,
  User,
  FileText,
  Eye,
  Download,
  Shield,
  CreditCard,
  Building,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

// Dialog Component
function ConfirmDialog({ isOpen, onClose, onConfirm, action }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {action} this loan application? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${
              action === "approve"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {action === "approve" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Document Preview Component
function DocumentPreview({ documents }) {
  const getDocumentName = (path) => {
    return path.split("\\").pop().split("-")[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(documents).map(([key, path]) => (
        <div key={key} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700 capitalize">
              {getDocumentName(path)}
            </span>
            <div className="flex gap-2">
              <a
                href={`http://localhost:3000/${path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="View Document"
              >
                <Eye className="w-4 h-4" />
              </a>
              <a
                href={`http://localhost:3000/${path}`}
                download
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminLoanDashboard() {
  const [loans, setLoans] = useState([]);
  const success = 1;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get("/loan/pending-loans", {
        withCredentials: true,
      });
      setLoans(response.data);
    } catch (error) {
      setError("Error fetching loans: " + error.message);
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = (loanId, action) => {
    setPendingAction({ loanId, action });
    setShowConfirmDialog(true);
  };

  const handleLoanAction = async () => {
    if (!pendingAction) return;

    const { loanId, action } = pendingAction;
    setShowConfirmDialog(false);

    try {
      const response = await api.post(
        `/loan/review/${loanId}`,
        { status: action === "approve" ? "approved" : "rejected" },
        { withCredentials: true }
      );

      if (success) {
        toast.success(
          `Loan ${action === "approve" ? "approved" : "rejected"} successfully`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        setSelectedLoan(null);
        await fetchLoans();
      } else {
        throw new Error("Failed to update loan status");
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan status");
    } finally {
      setPendingAction(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading loans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const renderLoanDetails = () => {
    if (!selectedLoan) return null;

    switch (activeTab) {
      case "details":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">
                  ₹{selectedLoan.loanAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.term} months</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.interestRate}% Interest</span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span>Purpose: {selectedLoan.purpose}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-500" />
                <span>Bank: {selectedLoan.disbursement.bankName}</span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span>A/C: {selectedLoan.disbursement.accountNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span>IFSC: {selectedLoan.disbursement.ifscCode}</span>
              </div>
            </div>
          </div>
        );

      case "documents":
        return <DocumentPreview documents={selectedLoan.documents} />;

      case "applicant":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.applicant.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.applicant.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span>PAN: {selectedLoan.panNumber}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Guarantor Details</h3>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.guarantor.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{selectedLoan.guarantor.contactNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>Relation: {selectedLoan.guarantor.relationship}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingAction(null);
        }}
        onConfirm={handleLoanAction}
        action={pendingAction?.action}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Loan Applications</h1>
          <p className="text-gray-500">
            Review and manage pending loan applications
          </p>
        </div>

        <div className="flex gap-6">
          {/* Loan List */}
          <div className="w-1/3 space-y-4">
            {loans
              .filter((loan) => loan.status === "pending")
              .map((loan) => (
                <div
                  key={loan._id}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer
                  ${
                    selectedLoan?._id === loan._id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedLoan(loan)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        {loan.loanCategory.charAt(0).toUpperCase() +
                          loan.loanCategory.slice(1)}{" "}
                        Loan
                      </h2>
                      <p className="text-sm text-gray-500">
                        ID: {loan._id.slice(-8)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {loan.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>₹{loan.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(loan.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}

            {loans.filter((loan) => loan.status === "pending").length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-600">
                  No pending applications
                </h3>
                <p className="text-gray-500 mt-2">All caught up!</p>
              </div>
            )}
          </div>

          {/* Loan Details */}
          {selectedLoan ? (
            <div className="w-2/3 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedLoan.loanCategory.charAt(0).toUpperCase() +
                      selectedLoan.loanCategory.slice(1)}{" "}
                    Loan Application
                  </h2>
                  <p className="text-gray-500">
                    Application ID: {selectedLoan._id}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all"
                    onClick={() =>
                      handleConfirmAction(selectedLoan._id, "reject")
                    }
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>

                  <button
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition-all"
                    onClick={() =>
                      handleConfirmAction(selectedLoan._id, "approve")
                    }
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex gap-6">
                  <button
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative
                        ${
                          activeTab === "details"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Loan Details
                  </button>
                  <button
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative
                        ${
                          activeTab === "documents"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("documents")}
                  >
                    Documents
                  </button>
                  <button
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative
                        ${
                          activeTab === "applicant"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("applicant")}
                  >
                    Applicant Info
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {renderLoanDetails()}
            </div>
          ) : (
            <div className="w-2/3 bg-white rounded-lg shadow p-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Select a loan application to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLoanDashboard;
