const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, unique: true },
  excerpt:   { type: String, required: true },
  content:   { type: String, required: true },
  category:  { type: String, enum: ['SEO','Social Media','PPC','Content','Email','Strategy','News'], default: 'Strategy' },
  tags:      [{ type: String }],
  coverImage:{ type: String, default: '' },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['draft','published'], default: 'draft' },
  views:     { type: Number, default: 0 },
}, { timestamps: true });

PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
