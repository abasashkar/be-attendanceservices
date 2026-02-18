const router = require('express').Router();
const prisma = require('../config/prisma');

router.post('/teachers', async (req, res) => {
  const { id, name, email } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ error: 'id, name and email are required' });
  }

  const teacher = await prisma.teacher.upsert({
    where: { id },
    create: { id, name, email },
    update: { name, email },
  });

  res.json(teacher);
});

module.exports = router;
