const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { bookingRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/',
  bookingRateLimiter,
  [
    body('userName').trim().isLength({ min: 2, max: 100 }),
    body('phone').trim().matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
    body('serviceId').isInt({ min: 1 }),
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('time').matches(/^\d{2}:\d{2}$/),
    body('email').optional().isEmail().normalizeEmail(),
    body('masterId').optional().isInt({ min: 1 }),
    body('notes').optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, phone, email, serviceId, masterId, date, time, notes } = req.body;

    try {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const conflict = await prisma.appointment.findFirst({
        where: {
          date,
          time,
          masterId: masterId || undefined,
          status: { notIn: ['CANCELLED'] },
        },
      });
      if (conflict) {
        return res.status(409).json({ error: 'This time slot is already booked' });
      }

      const appointment = await prisma.appointment.create({
        data: {
          userName,
          phone,
          email,
          serviceId,
          masterId: masterId || null,
          date,
          time,
          notes,
        },
        include: { service: true, master: true },
      });

      res.status(201).json(appointment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { status, date, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (status) where.status = status;
  if (date) where.date = date;

  try {
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { service: true, master: true },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
        skip,
        take: Number(limit),
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({ appointments, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['NEW', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { service: true, master: true },
    });
    res.json(appointment);
  } catch {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

router.get('/available-slots', async (req, res) => {
  const { date, masterId } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const allSlots = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  try {
    const booked = await prisma.appointment.findMany({
      where: {
        date,
        masterId: masterId ? Number(masterId) : undefined,
        status: { notIn: ['CANCELLED'] },
      },
      select: { time: true },
    });

    const bookedTimes = new Set(booked.map((a) => a.time));
    const available = allSlots.filter((slot) => !bookedTimes.has(slot));

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
