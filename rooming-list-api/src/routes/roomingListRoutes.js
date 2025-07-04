const express = require('express');
const router = express.Router();
const { insertData, getRoomingLists, getBookingsByRoomingListId } = require('../controllers/roomingListController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/data/insert', authenticateToken, insertData);
router.get('/rooming-lists', authenticateToken, getRoomingLists);
router.get('/rooming-lists/:id/bookings', authenticateToken, getBookingsByRoomingListId);

module.exports = router;