const db = require('../config/db');

// Helper: Convert "HH:MM:SS" to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper: Convert minutes back to "HH:MM"
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// @desc    Get available slots for a specific date and event type
// @route   GET /api/bookings/slots?date=YYYY-MM-DD&eventTypeId=1
exports.getAvailableSlots = async (req, res) => {
  const { date, eventTypeId } = req.query;

  if (!date || !eventTypeId) {
    return res.status(400).json({ message: 'Date and Event Type ID are required' });
  }

  try {
    // 1. Get the day of the week for the requested date (e.g., "Monday")
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // 2. Get Event Duration
    const [eventTypes] = await db.query('SELECT duration FROM event_types WHERE id = ?', [eventTypeId]);
    if (eventTypes.length === 0) return res.status(404).json({ message: 'Event type not found' });
    const duration = eventTypes[0].duration;

    // 3. Get Availability for that day
    const [availability] = await db.query('SELECT start_time, end_time FROM availability WHERE day_of_week = ?', [dayOfWeek]);
    
    // If no availability set for this day, return empty slots
    if (availability.length === 0) {
      return res.json([]); 
    }

    const startMinutes = timeToMinutes(availability[0].start_time);
    const endMinutes = timeToMinutes(availability[0].end_time);

    // 4. Get existing bookings for that date to check conflicts
    // We check where start_time falls on the requested date
    const [existingBookings] = await db.query(
      `SELECT start_time, duration FROM bookings 
       JOIN event_types ON bookings.event_type_id = event_types.id 
       WHERE DATE(start_time) = ?`, 
      [date]
    );

    // Convert existing bookings to a list of busy intervals [start, end] in minutes
    const busyIntervals = existingBookings.map(booking => {
      const bookingStart = new Date(booking.start_time);
      const startMin = bookingStart.getHours() * 60 + bookingStart.getMinutes();
      return { start: startMin, end: startMin + booking.duration };
    });

    // 5. Generate Slots
    const slots = [];
    for (let time = startMinutes; time + duration <= endMinutes; time += duration) { // simple logic: increments by duration
      const slotStart = time;
      const slotEnd = time + duration;

      // Check if this slot overlaps with any busy interval
      const isConflict = busyIntervals.some(busy => {
        return (slotStart < busy.end && slotEnd > busy.start); // Overlap condition
      });

      if (!isConflict) {
        slots.push(minutesToTime(slotStart));
      }
    }

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { eventTypeId, bookerName, bookerEmail, startTime } = req.body; // startTime e.g., "2026-01-20 09:30:00"

  if (!eventTypeId || !bookerName || !bookerEmail || !startTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Calculate End Time based on duration
    const [eventTypes] = await db.query('SELECT duration FROM event_types WHERE id = ?', [eventTypeId]);
    if (eventTypes.length === 0) return res.status(404).json({ message: 'Event type not found' });
    
    const duration = eventTypes[0].duration;
    const startObj = new Date(startTime);
    const endObj = new Date(startObj.getTime() + duration * 60000); // Add minutes in milliseconds

    // Insert Booking
    const [result] = await db.query(
      'INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
      [eventTypeId, bookerName, bookerEmail, startObj, endObj]
    );

    res.status(201).json({ message: 'Booking confirmed', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};