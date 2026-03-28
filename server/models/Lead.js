const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, lowercase: true },
  company: { type: String, trim: true },
  service: { type: String, enum: ['SEO','Social Media Marketing','Website — WordPress','Website — Full Stack (Frontend)','Website — Full Stack (Frontend + Backend)','Paid Advertising','Full Package','Other'], default: 'Other' },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new','contacted','qualified','closed','lost'], default: 'new' },
  notes:   { type: String, default: '' },
  source:  { type: String, default: 'website' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
