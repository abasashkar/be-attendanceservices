const router = require('express').Router();
const prisma = require('../config/prisma');

router.post('/teachers', async (req, res) => {
  const { id, name } = req.body;

  const teacher = await prisma.teacher.create({
    data: { id, name }
  });

  res.json(teacher);
});

module.exports = router;
