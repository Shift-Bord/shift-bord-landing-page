# Shift Bord – Landing Page & CPanel

> Modern, high-performance landing page and lead management Control Panel (CPanel) for **Shift Bord** (Custom Software, Mobile Applications & Digital Platforms).

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: HTML5, Tailwind CSS, Space Grotesk & Hanken Grotesk fonts, Material Symbols
- **Admin**: Built-in CPanel with real-time analytics, filtering, and CSV export

---

## 📁 Project Structure

```
.
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── Inquiry.js         # Mongoose schema for consultation requests
├── public/
│   ├── css/
│   │   └── style.css      # Custom animations, transitions, and theme styles
│   └── js/
│       └── main.js        # Client-side interactions & form AJAX
├── routes/
│   ├── admin.js           # CPanel protected routes & APIs
│   └── contact.js         # Public contact form submission API
├── utils/
│   └── db.js              # Database helper & aggregation functions
├── views/
│   ├── admin/
│   │   ├── dashboard.html # CPanel admin dashboard UI
│   │   └── login.html     # CPanel admin login UI
│   ├── 404.html           # Custom 404 error page
│   └── index.html         # Public Shift Bord landing page
├── .env.example           # Example environment configuration
├── package.json
└── server.js              # Express application entrypoint
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Shift-Bord/shift-bord-landing-page.git
cd shift-bord-landing-page

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/shiftbord
ADMIN_USER=admin
ADMIN_PASS=shiftbord2026
```

### 4. Run the Project
```bash
# Production mode
npm start

# Development mode (with nodemon auto-reload)
npm run dev
```

- **Public Landing Page**: `http://localhost:3000`
- **CPanel (Admin Dashboard)**: `http://localhost:3000/admin`

---

## 🎛️ CPanel Features

- **Lead Management**: View, filter, and search consultation requests.
- **Direct Actions**: One-click WhatsApp chat (`wa.me`) and Email trigger (`mailto:`).
- **Status Workflow**: Manage lead lifecycle (`New`, `Contacted`, `In Progress`, `Closed`).
- **Private Team Notes**: Record internal notes on each inquiry.
- **Export Data**: One-click CSV export of all inquiries.
- **Secure Authentication**: Cookie-based session authentication for admin routes.

---

## 📄 License
© 2026 Shift Bord. All rights reserved.
