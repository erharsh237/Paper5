const router = require('express').Router();
const Lead = require('../models/Lead');
const { protect, requireAdmin } = require('../middleware/auth');

// All leads routes require auth
router.use(protect);

// GET /api/leads — list all with filters
router.get('/', async (req, res) => {
  try {
    const { status, service, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (service) query.service = service;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leads/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byService = await Lead.aggregate([{ $group: { _id: '$service', count: { $sum: 1 } } }]);
    const thisMonth = await Lead.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });
    res.json({ total, thisMonth, byStatus, byService });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/leads/:id
router.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
