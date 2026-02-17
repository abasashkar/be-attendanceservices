const prisma = require("../config/prisma");
const { resolveConflict } = require("../utils/conflictResolver");

exports.createRecord = async ({ classId, date }) => {
  return prisma.attendanceRecord.create({
    data: {
      classId,
      date: new Date(date),
    },
  });
};

exports.markAttendance = async ({ recordId, studentId, status }) => {
  return prisma.attendanceEntry.upsert({
    where: {
      recordId_studentId: { recordId, studentId },
    },
    update: { status },
    create: { recordId, studentId, status },
  });
};

exports.syncAttendance = async ({ entries }) => {
  for (const entry of entries) {
    const existing = await prisma.attendanceEntry.findUnique({
      where: {
        recordId_studentId: {
          recordId: entry.recordId,
          studentId: entry.studentId,
        },
      },
    });

    const resolved = resolveConflict(existing, entry);

    await prisma.attendanceEntry.upsert({
      where: {
        recordId_studentId: {
          recordId: entry.recordId,
          studentId: entry.studentId,
        },
      },
      update: resolved,
      create: resolved,
    });
  }

  return { message: "Offline sync completed" };
};

exports.getAttendanceByRecord = async (recordId) => {
  return prisma.attendanceEntry.findMany({
    where: { recordId },
    include: {
      student: true, // optional but useful
    },
  });
};
