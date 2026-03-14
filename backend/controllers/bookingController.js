const db = require('../config/db');
const generateSlots = require('../utils/generateSlots');

exports.getAvailabilityByLink = async (req, res) => {
  const { link } = req.params;

  try {
    const [availabilities] = await db.query(
      "SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, start_time, end_time FROM availability WHERE booking_link = ?",
      [link]
    );

    if (availabilities.length === 0) {
      return res.status(404).json({ error: 'Booking link not found' });
    }

    const [bookings] = await db.query(
      "SELECT DATE_FORMAT(date, '%Y-%m-%d') as date, time FROM bookings WHERE booking_link = ?",
      [link]
    );

    const result = availabilities.map(avail => {
      const allSlots = generateSlots(avail.start_time, avail.end_time);
      const bookedSlots = bookings
        .filter(b => b.date === avail.date)
        .map(b => b.time.slice(0, 5));

      // Instead of filtering, return objects with isBooked status
      const slotsWithStatus = allSlots.map(time => ({
        time,
        isBooked: bookedSlots.includes(time)
      }));

      return {
        date: avail.date,
        slots: slotsWithStatus
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  const { bookingLink, date, time } = req.body;

  if (!bookingLink || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await db.query(
      'INSERT INTO bookings (booking_link, date, time) VALUES (?, ?, ?)',
      [bookingLink, date, time]
    );

    res.status(200).json({ message: 'Slot booked successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slot already booked' });
    }
    res.status(500).json({ error: error.message });
  }
};
