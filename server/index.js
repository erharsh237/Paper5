const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/leads',   require('./routes/leads'));
app.use('/api/posts',   require('./routes/posts'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chat',    require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'Paper5 API running', time: new Date() }));

// Connect MongoDB and start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });
