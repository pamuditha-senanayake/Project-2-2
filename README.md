# ⚙️ PERN Stack Business Insights Platform

A full-stack web application built using the **PERN stack** (PostgreSQL, Express.js, React, Node.js) designed to empower business owners with AI-powered sales analytics, customer handling tools, and administrative control—all in one place.

---

## 🚀 Features

### 🤖 AI-Powered Insights

* Integrated **Gemini Flash AI model** for real-time:

  * Sales trend analysis
  * Business improvement suggestions
  * Marketing ideas based on customer data

### 📊 Dashboard with Charts

* Real-time sales & customer metrics
* Built using **Chart.js**

### 👥 Customer Profile Management

* Edit, view, and manage customer data beautifully
* Built-in validation and smart UI interactions

### 📥 Customer Inquiries & Admin Responses

* Customers can send product/service inquiries
* Admins can view and respond from the dashboard

### 🧑‍💼 Admin Panel

* Manage users, inquiries, and responses
* Handle logins and reset passwords via email
* Secure with JWT-based authentication

### ✨ SweetAlert Popups

* Polished interactions using **SweetAlert2**

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Axios, Chart.js
* **Backend**: Node.js, Express.js, JWT, Bcrypt
* **Database**: PostgreSQL
* **AI Integration**: Gemini Flash (via API)
* **Email System**: Nodemailer

---

## 🧱 Folder Structure

```
pern-insights/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/      # Axios API calls
│   │   └── App.js
│   └── public/
├── server/                # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── README.md
└── database/
    └── schema.sql
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourusername/pern-insights.git
cd pern-insights
```

### 2️⃣ Setup PostgreSQL Database

* Create a new database
* Import schema from `database/schema.sql`

### 3️⃣ Install Backend Dependencies

```bash
cd server
npm install
npm run dev
```

### 4️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
npm start
```

---

## 🔐 Authentication & Permissions

* Admin and user roles supported
* Login protected with JWT
* Passwords hashed with Bcrypt

---

## 📈 AI Business Analyzer (Gemini Flash)

* Automatically analyzes:

  * Monthly/weekly sales
  * Customer preferences
  * Product performance
* Returns actionable suggestions via API

---

## 📬 Email Features

* Forgot Password → Email reset link
* Inquiry submission confirmation emails

---

## 💡 Use Cases

* Small businesses wanting to track sales
* Admins who want automatic suggestions for growth
* User-friendly admin panel for managing backend tasks

---

## 👨‍💻 Author

**Pamuditha Senanayake**
[LinkedIn](https://www.linkedin.com/in/pamuditha-senanayake-87794357/)
Email: [pamudithasenanayake@gmail.com](mailto:pamudithasenanayake@gmail.com)

---

## 📜 License

MIT
