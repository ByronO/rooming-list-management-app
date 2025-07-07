const pool = require('../db');
const insertJsonData = require('../utils/insertJsonData');

/**
 * Invokes the insertJsonData utility function to load and insert data from
 * JSON files into the database. Sends a success response if data is inserted
 * without errors, otherwise sends an error response.
 * 
 * @param {Object} req - The request object (not used in this function).
 * @param {Object} res - The response object used to send back the JSON response.
 */
const insertData = async (req, res) => {
  try {
    await insertJsonData();
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
};

/**
 * Fetches data from the rooming_lists table, joins with events and bookings
 * tables to include event name, and calculates the start and end dates based 
 * on the bookings associated with each rooming list. Results are ordered by 
 * cut-off date.
 * 
 * @param {Object} req - The request object (not used in this function).
 * @param {Object} res - The response object used to send back the JSON data.
 */
const getRoomingLists = async (req, res) => {
  try {
    const query = `
      SELECT rl.*, e.event_name,
        MIN(b.check_in_date) AS start_date,
        MAX(b.check_out_date) AS end_date,
        COUNT(DISTINCT b.booking_id) AS bookings_count
      FROM rooming_lists rl
      JOIN events e ON rl.event_id = e.event_id
      LEFT JOIN rooming_list_bookings rlb ON rl.rooming_list_id = rlb.rooming_list_id
      LEFT JOIN bookings b ON b.booking_id = rlb.booking_id
      GROUP BY rl.rooming_list_id, e.event_name
      ORDER BY rl.cut_off_date ASC;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching rooming lists:', err);
    res.status(500).json({ error: 'Error fetching rooming lists' });
  }
};

/**
 * Fetches data from the bookings table, joins with rooming_list_bookings table
 * to filter by rooming list ID. Results are ordered by check-in date.
 * 
 * @param {Object} req - The request object containing the rooming list ID in the params.
 * @param {Object} res - The response object used to send back the JSON data.
 */
const getBookingsByRoomingListId = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT b.*
      FROM bookings b
      INNER JOIN rooming_list_bookings rlb ON b.booking_id = rlb.booking_id
      WHERE rlb.rooming_list_id = $1
      ORDER BY b.check_in_date ASC;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this rooming list.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

module.exports = {
  insertData,
  getRoomingLists,
  getBookingsByRoomingListId,
};