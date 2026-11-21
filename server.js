require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const db = require('./utils/db');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// ─── Routes ──────────────────────────────────────────────────────────────────
// Public Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Contact / consultation form API
app.use('/api/contact', contactRouter);

// Admin Control Panel (CPanel)
app.use('/admin', adminRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ─── Start Server & Connect MongoDB ──────────────────────────────────────────
async function startServer() {
  await connectDB();
  await db.seedIfEmpty();

  app.listen(PORT, () => {
    console.log(`\n🚀  Shift Bord landing page running at http://localhost:${PORT}`);
    console.log(`🛡️   CPanel (Admin Dashboard) at http://localhost:${PORT}/admin\n`);
  });
}

startServer();
