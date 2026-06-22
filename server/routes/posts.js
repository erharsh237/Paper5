const router = require('express').Router();
const Post = require('../models/Post');
const { protect, requireAdmin } = require('../middleware/auth');

// GET /api/posts — public, published only
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/admin — all posts (protected)
router.get('/admin', protect, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:slug — public single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — create (protected)
router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id — update (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — delete (protected)
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
