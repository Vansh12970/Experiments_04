const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Seats layout (10 seats)
let seats = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: 'available', // available, locked, booked
  lockedBy: null,
  lockExpiry: null
}));

// Lock timeout in milliseconds (e.g., 1 minute)
const LOCK_TIMEOUT = 60000;

// Helper function to release expired locks
function releaseExpiredLocks() {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === 'locked' && seat.lockExpiry <= now) {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }
  });
}

// GET all seats
app.get('/seats', (req, res) => {
  releaseExpiredLocks();
  res.json(seats);
});

// POST lock a seat
app.post('/seats/:id/lock', (req, res) => {
  const seatId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId is required' });

  releaseExpiredLocks();

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: 'Seat not found' });
  if (seat.status !== 'available') return res.status(409).json({ error: 'Seat not available' });

  seat.status = 'locked';
  seat.lockedBy = userId;
  seat.lockExpiry = Date.now() + LOCK_TIMEOUT;

  res.json({ message: `Seat ${seatId} locked by user ${userId}` });
});

// POST book a seat
app.post('/seats/:id/book', (req, res) => {
  const seatId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId is required' });

  releaseExpiredLocks();

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: 'Seat not found' });

  if (seat.status === 'booked') {
    return res.status(409).json({ error: 'Seat already booked' });
  }

  if (seat.status === 'locked' && seat.lockedBy !== userId) {
    return res.status(403).json({ error: 'Seat locked by another user' });
  }

  seat.status = 'booked';
  seat.lockedBy = userId;
  seat.lockExpiry = null;

  res.json({ message: `Seat ${seatId} successfully booked by user ${userId}` });
});

// POST release a lock manually (optional)
app.post('/seats/:id/release', (req, res) => {
  const seatId = parseInt(req.params.id);
  const { userId } = req.body;

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ error: 'Seat not found' });

  if (seat.status === 'locked' && seat.lockedBy === userId) {
    seat.status = 'available';
    seat.lockedBy = null;
    seat.lockExpiry = null;
    return res.json({ message: `Lock released for seat ${seatId}` });
  }

  res.status(403).json({ error: 'Cannot release lock' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
