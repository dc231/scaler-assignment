const db = require('../config/db');

// @desc    Get all event types
// @route   GET /api/event-types
exports.getEventTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM event_types');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event type
// @route   POST /api/event-types
exports.createEventType = async (req, res) => {
  const { title, description, duration, slug } = req.body;

  // Basic validation
  if (!title || !duration || !slug) {
    return res.status(400).json({ message: 'Title, duration, and slug are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO event_types (title, description, duration, slug) VALUES (?, ?, ?, ?)',
      [title, description, duration, slug]
    );
    res.status(201).json({ id: result.insertId, title, description, duration, slug });
  } catch (error) {
    // Check for duplicate slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'URL Slug must be unique' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event type
// @route   DELETE /api/event-types/:id
exports.deleteEventType = async (req, res) => {
  try {
    await db.query('DELETE FROM event_types WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event type deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};