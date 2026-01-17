const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/event-types', eventRoutes);
app.use('/api/availability', availabilityRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Cal.com Clone API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});