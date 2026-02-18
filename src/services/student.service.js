const prisma = require("../config/prisma");
const redis = require("../config/redis");

exports.getStudentsByClass = async (classId, search) => {
  const hasSearch = search && typeof search === "string" && search.trim();
  if (!hasSearch) {
    const cacheKey = `students:${classId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const where = { classId };
  if (hasSearch) {
    where.name = { contains: search.trim(), mode: "insensitive" };
  }

  const students = await prisma.student.findMany({
    where,
  });

  if (!hasSearch) {
    await redis.set(`students:${classId}`, JSON.stringify(students), "EX", 1800);
  }
  return students;
};

exports.createStudent = async ({ name, classId }) => {
  const student = await prisma.student.create({
    data: {
      name,
      class: {
        connect: { id: classId },
      },
    },
  });
  await redis.del(`students:${classId}`);
  return student;
};
