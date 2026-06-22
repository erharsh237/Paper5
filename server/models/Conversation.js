const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  sessionId:       { type: String, required: true, unique: true },
  messages:        [MessageSchema],
  interestedIn:    [{ type: String, enum: ['SEO','Social Media Marketing','Website — WordPress','Website — Full Stack (Frontend)','Website — Full Stack (Frontend + Backend)','Paid Advertising','Full Package','Other'] }],
  pagesReferenced: [{ type: String }],
  contactName:     { type: String },
  contactEmail:    { type: String },
  contactPhone:    { type: String },
  leadCaptured:    { type: Boolean, default: false },
  lead:            { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  endedAt:         { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
