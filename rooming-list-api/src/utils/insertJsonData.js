const fs = require('fs');
const path = require('path');
const pool = require('../db');

const loadJson = (filename) => {
  const filepath = path.join(__dirname, '../data', filename);
  const rawData = fs.readFileSync(filepath);
  return JSON.parse(rawData);
};

/**
 * Fetches JSON data from the data folder, truncates the tables, and then inserts
 * the data into the tables. If any of the inserts fail, the transaction is rolled
 * back. If all succeeds, the transaction is committed.
 * 
 * @returns {Object} An object with a success property indicating whether the
 * data was inserted successfully or not.
 */
const insertJsonData = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clean up existing data
    await client.query('DELETE FROM rooming_list_bookings');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM rooming_lists');

    // Load JSON data
    const bookings = loadJson('bookings.json');
    const roomingLists = loadJson('rooming-lists.json');
    const roomingListBookings = loadJson('rooming-list-bookings.json');

    // Insert rooming_lists
    for (const rl of roomingLists) {
      await client.query(`
        INSERT INTO rooming_lists (
          rooming_list_id, event_id, hotel_id,
          rfp_name, cut_off_date, status, agreement_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        rl.roomingListId, rl.eventId, rl.hotelId,
        rl.rfpName, rl.cutOffDate, rl.status, rl.agreement_type
      ]);
    }

    // Insert bookings
    for (const b of bookings) {
      await client.query(`
        INSERT INTO bookings (
          booking_id, hotel_id, event_id,
          guest_name, guest_phone_number, check_in_date, check_out_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        b.bookingId, b.hotelId, b.eventId,
        b.guestName, b.guestPhoneNumber, b.checkInDate, b.checkOutDate
      ]);
    }

    // Insert rooming_list_bookings
    for (const rlb of roomingListBookings) {
      await client.query(`
        INSERT INTO rooming_list_bookings (rooming_list_id, booking_id)
        VALUES ($1, $2)
      `, [rlb.roomingListId, rlb.bookingId]);
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = insertJsonData;