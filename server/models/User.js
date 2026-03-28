const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  email:             { type: String, required: true, unique: true, lowercase: true },
  password:          { type: String, required: true, minlength: 6 },
  role:              { type: String, enum: ['admin', 'editor'], default: 'admin' },
  resetToken:        { type: String },
  resetTokenExpire:  { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};

UserSchema.methods.generateResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetTokenExpire = Date.now() + (parseInt(process.env.RESET_TOKEN_EXPIRE_MINUTES) || 15) * 60 * 1000;
  return token; // return raw token (sent in email), store hashed
};

module.exports = mongoose.model('User', UserSchema);
