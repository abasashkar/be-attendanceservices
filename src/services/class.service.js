const prisma = require("../config/prisma");
const redis = require("../config/redis");

exports.getClassesByTeacher = async (teacherId) => {
  const cacheKey = `classes:${teacherId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const classes = await prisma.class.findMany({
    where: { teacherId },
  });

  await redis.set(cacheKey, JSON.stringify(classes), "EX", 1800);
  return classes;
};

exports.createClass = async ({ name, teacherId }) => {
  return prisma.class.create({
    data: {
      name,
      teacherId,
    },
  });
};

