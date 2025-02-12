import React, { useState } from 'react';

const LoanProposalList = () => {
  // Mock data - replace with actual API data
  const [loans, setLoans] = useState([
    {
      id: 1,
      applicantName: "John Doe",
      loanAmount: "50000",
      loanCategory: "personal",
      term: "12",
      panNumber: "ABCDE1234F",
      status: "pending",
      applicationDate: "2024-01-15",
      documents: {
        idProof: "id_proof.pdf",
        bankStatement: "bank_statement.pdf",
        itr: "itr.pdf",
        utilityBill: "utility_bill.pdf",
        businessLicense: null,
        businessContinuationProof: null
      }
    },
    {
      id: 2,
      applicantName: "Jane Smith",
      loanAmount: "100000",
      loanCategory: "business",
      term: "24",
      panNumber: "FGHIJ5678K",
      status: "pending",
      applicationDate: "2024-01-17",
      documents: {
        idProof: "id_proof_2.pdf",
        // bankStatement: "bank_statement_2.pdf",
        itr: "itr_2.pdf",
        utilityBill: "utility_bill_2.pdf",
        businessLicense: "business_license.pdf",
        businessContinuationProof: "business_proof.pdf"
      }
    }
  ]);

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (loanId) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: 'approved' } : loan
    ));
    setShowModal(false);
  };

  const handleReject = (loanId) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: 'rejected' } : loan
    ));
    setShowModal(false);
  };

  const downloadDocument = (documentName) => {
    // Mock download functionality - replace with actual API call
    console.log(`Downloading ${documentName}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Loan Applications Dashboard</h1>
      
      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map((loan) => (
          <div 
            key={loan.id} 
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => {
              setSelectedLoan(loan);
              setShowModal(true);
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{loan.applicantName}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Amount:</span> ₹{parseInt(loan.loanAmount).toLocaleString()}</p>
              <p><span className="font-medium">Category:</span> {loan.loanCategory}</p>
              <p><span className="font-medium">Term:</span> {loan.term} months</p>
              <p><span className="font-medium">Applied:</span> {loan.applicationDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Loan Application Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Applicant Information</h3>
                  <p><span className="font-medium">Name:</span> {selectedLoan.applicantName}</p>
                  <p><span className="font-medium">PAN:</span> {selectedLoan.panNumber}</p>
                  <p><span className="font-medium">Loan Amount:</span> ₹{parseInt(selectedLoan.loanAmount).toLocaleString()}</p>
                  <p><span className="font-medium">Category:</span> {selectedLoan.loanCategory}</p>
                  <p><span className="font-medium">Term:</span> {selectedLoan.term} months</p>
                  <p><span className="font-medium">Application Date:</span> {selectedLoan.applicationDate}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  {Object.entries(selectedLoan.documents).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className="space-x-2">
                          <button 
                            onClick={() => downloadDocument(value)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => console.log(`Viewing ${value}`)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {selectedLoan.status === 'pending' && (
                <div className="flex justify-end gap-4 border-t pt-4">
                  <button
                    onClick={() => handleReject(selectedLoan.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedLoan.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanProposalList;