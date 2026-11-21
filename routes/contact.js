const express = require('express');
const router = express.Router();
const db = require('../utils/db');

/**
 * POST /api/contact
 * Handles consultation form submission and persists it directly to MongoDB.
 */
router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, service, budget, details } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, phone, details).'
      });
    }

    // Persist to MongoDB
    const newLead = await db.createInquiry({
      name,
      company,
      email,
      phone,
      service,
      budget,
      details
    });

    console.log('\n📬  New Consultation Request Saved to MongoDB!');
    console.log('─────────────────────────────────────────────');
    console.log(`Lead ID : ${newLead.id}`);
    console.log(`Name    : ${name}`);
    console.log(`Company : ${company || '—'}`);
    console.log(`Email   : ${email}`);
    console.log(`Phone   : ${phone}`);
    console.log(`Service : ${service || '—'}`);
    console.log(`Budget  : ${budget || '—'}`);
    console.log(`Details : ${details}`);
    console.log('─────────────────────────────────────────────\n');

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been received. We will get back to you within 24 hours.',
      leadId: newLead.id
    });
  } catch (err) {
    console.error('Error saving contact inquiry:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error saving inquiry. Please try again later.'
    });
  }
});

module.exports = router;
