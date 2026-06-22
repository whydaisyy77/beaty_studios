const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const items = await prisma.gallery.findMany({
      where: category ? { category } : {},
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  [
    body('category').trim().notEmpty(),
    body('title').optional().trim().isLength({ max: 100 }),
    body('isFeatured').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    try {
      const item = await prisma.gallery.create({
        data: {
          imageUrl: req.file.path,
          publicId: req.file.filename,
          category: req.body.category,
          title: req.body.title || null,
          isFeatured: req.body.isFeatured === 'true',
        },
      });
      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await prisma.gallery.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ error: 'Not found' });

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    await prisma.gallery.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/featured', authenticate, requireAdmin, async (req, res) => {
  try {
    const item = await prisma.gallery.update({
      where: { id: Number(req.params.id) },
      data: { isFeatured: req.body.isFeatured },
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
