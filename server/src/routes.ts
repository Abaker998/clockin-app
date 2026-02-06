import { Router, Request, Response } from 'express';
import db from './database';

const router = Router();

// LOGIN - check if PIN is valid
router.post('/login', (req: Request, res: Response) => {
  const { pin } = req.body;

  const user = db.prepare('SELECT id, name FROM users WHERE pin = ?').get(pin) as
    | { id: number; name: string }
    | undefined;

  if (!user) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }

  return res.json({ userId: user.id, name: user.name });
});

// CLOCK IN
router.post('/clock-in', (req: Request, res: Response) => {
  const { userId } = req.body;

  // Check if already clocked in
  const open = db.prepare(
    'SELECT id FROM time_records WHERE user_id = ? AND clock_out IS NULL'
  ).get(userId);

  if (open) {
    return res.status(400).json({ error: 'Already clocked in' });
  }

  const now = new Date().toLocaleString();
  db.prepare('INSERT INTO time_records (user_id, clock_in) VALUES (?, ?)').run(userId, now);

  return res.json({ message: 'Clocked in', clockIn: now });
});

// CLOCK OUT
router.post('/clock-out', (req: Request, res: Response) => {
  const { userId } = req.body;

  const open = db.prepare(
    'SELECT id FROM time_records WHERE user_id = ? AND clock_out IS NULL'
  ).get(userId) as { id: number } | undefined;

  if (!open) {
    return res.status(400).json({ error: 'Not clocked in' });
  }

  const now = new Date().toLocaleString();
  db.prepare('UPDATE time_records SET clock_out = ? WHERE id = ?').run(now, open.id);

  return res.json({ message: 'Clocked out', clockOut: now });
});

// HISTORY
router.get('/history/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  const records = db.prepare(
    'SELECT clock_in, clock_out FROM time_records WHERE user_id = ? ORDER BY id DESC'
  ).all(userId);

  return res.json({ records });
});

export default router;