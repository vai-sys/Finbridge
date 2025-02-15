# FinBridge - Fund Pooling & Crowdfunding Platform

FinBridge is a **MERN stack-based** platform that enables fund pooling and crowdfunding for borrowers and investors. It allows **borrowers** to request loans, which are approved by banks before becoming available for **investors** to fund. The platform ensures security with **JWT authentication**, **KYC verification**, and integrates **payment gateways** (Razorpay & Stripe) for seamless transactions.

## 🚀 Features
- **User Roles:** Borrower & Investor
- **Fund Pooling:** Investors collectively fund loan requests
- **Bank Approval System:** Loans require bank verification before listing
- **KYC Verification:** Secure user onboarding
- **Secure Authentication:** JWT & Cookies
- **Loan Repayment System** (Future Enhancement)

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Cookies


## 📌 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/vai-sys/Finbridge.git
cd Finbridge
```

### 2️⃣ Install Dependencies
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd hackfront
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file in the `backend` directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```

### 4️⃣ Start the Server
#### Backend
```sh
cd backend
npm run dev
```
#### Frontend
```sh
cd frontend
npm start
```









