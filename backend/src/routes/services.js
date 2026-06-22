const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: { category: 'asc' },
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('price').isFloat({ min: 0 }),
    body('duration').isInt({ min: 5 }),
    body('category').trim().notEmpty(),
    body('description').optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const service = await prisma.service.create({ data: req.body });
      res.status(201).json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(service);
  } catch {
    res.status(404).json({ error: 'Service not found' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false },
    });
    res.json({ message: 'Service deactivated' });
  } catch {
    res.status(404).json({ error: 'Service not found' });
  }
});

module.exports = router;
