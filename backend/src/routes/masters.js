const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const masters = await prisma.master.findMany({
      where: { isActive: true },
      include: { schedules: true },
    });
    res.json(masters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('photo'),
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('specialty').trim().notEmpty(),
    body('bio').optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const master = await prisma.master.create({
        data: {
          name: req.body.name,
          specialty: req.body.specialty,
          bio: req.body.bio || null,
          photoUrl: req.file?.path || null,
        },
      });
      res.status(201).json(master);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put('/:id/schedule', authenticate, requireAdmin, async (req, res) => {
  const { schedules } = req.body;
  const masterId = Number(req.params.id);

  try {
    const updated = await Promise.all(
      schedules.map((s) =>
        prisma.schedule.upsert({
          where: { masterId_dayOfWeek: { masterId, dayOfWeek: s.dayOfWeek } },
          update: { startTime: s.startTime, endTime: s.endTime, isWorking: s.isWorking },
          create: { masterId, dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, isWorking: s.isWorking },
        })
      )
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.master.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: 'Master deactivated' });
  } catch {
    res.status(404).json({ error: 'Master not found' });
  }
});

module.exports = router;
