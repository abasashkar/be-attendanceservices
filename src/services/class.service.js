const prisma = require("../config/prisma");

const getClassesByTeacher = async (teacherId) => {
  console.log("⚡ Service: getClassesByTeacher for", teacherId);
  return prisma.class.findMany({
    where: { teacherId },
  });
};

module.exports = { getClassesByTeacher };
