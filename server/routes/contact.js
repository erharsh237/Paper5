const router = require('express').Router();
const Lead   = require('../models/Lead');
const { sendLeadNotification } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required' });

    const lead = await Lead.create({ name, email, company, service, message });

    // Fire-and-forget email — don't fail the request if email fails
    sendLeadNotification({ lead }).catch(err =>
      console.error('Lead notification email failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Thanks! We will be in touch within 24 hours.',
      lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
