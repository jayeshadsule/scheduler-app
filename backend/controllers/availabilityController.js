const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.saveAvailability = async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const userId = req.user.id;
  
  if (!date || !startTime || !endTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO availability (user_id, date, start_time, end_time) VALUES (?, ?, ?, ?)',
      [userId, date, startTime, endTime]
    );

    res.status(200).json({ 
      id: result.insertId,
      date, 
      startTime, 
      endTime,
      message: 'Availability saved. Generate a link to share.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateLink = async (req, res) => {
  const userId = req.user.id;
  const bookingLink = uuidv4();

  try {
    // Link all pending availabilities for this user to the new link
    const [result] = await db.query(
      'UPDATE availability SET booking_link = ? WHERE user_id = ? AND booking_link IS NULL',
      [bookingLink, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'No pending availabilities found to link' });
    }

    res.status(200).json({ bookingLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
