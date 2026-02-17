const prisma = require("../config/prisma");
const redis = require("../config/redis");

exports.getStudentsByClass = async (classId) => {
  const cacheKey = `students:${classId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const students = await prisma.student.findMany({
    where: { classId },
  });

  await redis.set(cacheKey, JSON.stringify(students), "EX", 1800);
  return students;
};

exports.createStudent = async ({ name, classId }) => {
  return prisma.student.create({
    data: {
      name,
      class: {
        connect: { id: classId }
      }
    }
  });
};
