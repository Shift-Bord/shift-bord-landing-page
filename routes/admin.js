const express = require('express');
const path = require('path');
const db = require('../utils/db');

const router = express.Router();

// Configurable Admin Credentials
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'shiftbord2026';
const AUTH_COOKIE = 'shiftbord_admin_token';
const AUTH_SECRET = 'shift_bord_cpanel_session_key_98234';

// Helper: Check Auth
function isAuthenticated(req) {
  return req.cookies && req.cookies[AUTH_COOKIE] === AUTH_SECRET;
}

// Middleware: Protect Admin UI and API
function requireAuth(req, res, next) {
  if (isAuthenticated(req)) {
    return next();
  }
  if (req.originalUrl.startsWith('/admin/api')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
  }
  return res.redirect('/admin/login');
}

// ─── Pages ─────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  if (isAuthenticated(req)) {
    return res.redirect('/admin/dashboard');
  }
  return res.redirect('/admin/login');
});

router.get('/login', (req, res) => {
  if (isAuthenticated(req)) {
    return res.redirect('/admin/dashboard');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'login.html'));
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'dashboard.html'));
});

// ─── API Endpoints ──────────────────────────────────────────────────────

// POST /admin/api/login
router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie(AUTH_COOKIE, AUTH_SECRET, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// POST /admin/api/logout
router.post('/api/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE);
  return res.json({ success: true, message: 'Logged out' });
});

// GET /admin/api/stats
router.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /admin/api/inquiries
router.get('/api/inquiries', requireAuth, async (req, res) => {
  try {
    const { status, service, search } = req.query;
    const inquiries = await db.getInquiries({ status, service, search });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /admin/api/inquiries/:id
router.patch('/api/inquiries/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const updated = await db.updateInquiry(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, inquiry: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /admin/api/inquiries/:id
router.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteInquiry(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /admin/api/export (CSV export from MongoDB)
router.get('/api/export', requireAuth, async (req, res) => {
  try {
    const inquiries = await db.getInquiries();
    
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Service', 'Budget', 'Status', 'Notes', 'Details'];
    
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = inquiries.map(i => [
      escapeCsv(i.id),
      escapeCsv(i.createdAt),
      escapeCsv(i.name),
      escapeCsv(i.company),
      escapeCsv(i.email),
      escapeCsv(i.phone),
      escapeCsv(i.service),
      escapeCsv(i.budget),
      escapeCsv(i.status),
      escapeCsv(i.notes || ''),
      escapeCsv(i.details)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=shiftbord_leads_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send('Error generating export');
  }
});

module.exports = router;
