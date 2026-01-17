const db = require('../config/db');

// @desc    Get availability settings
// @route   GET /api/availability
exports.getAvailability = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM availability');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set availability for a specific day
// @route   POST /api/availability
exports.updateAvailability = async (req, res) => {
  const { day, startTime, endTime } = req.body;

  if (!day || !startTime || !endTime) {
    return res.status(400).json({ message: 'Day, start time, and end time are required' });
  }

  try {
    // This SQL creates a new row or updates the existing one if the day already exists
    const query = `
      INSERT INTO availability (day_of_week, start_time, end_time)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE start_time = VALUES(start_time), end_time = VALUES(end_time)
    `;
    
    await db.query(query, [day, startTime, endTime]);
    
    res.json({ message: `Availability updated for ${day}`, day, startTime, endTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};