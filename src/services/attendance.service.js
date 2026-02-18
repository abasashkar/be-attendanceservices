const prisma = require("../config/prisma");

exports.createRecord = async ({ classId, date }) => {
  const dateObj = new Date(date);
  return prisma.attendanceRecord.upsert({
    where: {
      classId_date: { classId, date: dateObj },
    },
    create: { classId, date: dateObj },
    update: {},
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

exports.syncAttendance = async ({ classId, recordId, entries }) => {
  if (!classId || !recordId || !Array.isArray(entries)) {
    const err = new Error("classId, recordId, and entries (array) are required");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  const record = await prisma.attendanceRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    const err = new Error("Attendance record not found");
    err.code = "NOT_FOUND";
    throw err;
  }

  if (record.classId !== classId) {
    const err = new Error("Record does not belong to the given class");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  for (const entry of entries) {
    const { studentId, status } = entry;
    if (!studentId || status == null || status === undefined) {
      continue;
    }
    // Composite key @@unique([recordId, studentId]) requires both fields
    await prisma.attendanceEntry.upsert({
      where: {
        recordId_studentId: { recordId, studentId },
      },
      update: { status, synced: true },
      create: { recordId, studentId, status, synced: true },
    });
  }

  return { message: "Sync completed", recordId, count: entries.length };
};

exports.getAttendanceByRecord = async (recordId) => {
  return prisma.attendanceEntry.findMany({
    where: { recordId },
    include: {
      student: true, // optional but useful
    },
  });
};

exports.getRecordsByClassId = async (classId) => {
  return prisma.attendanceRecord.findMany({
    where: { classId },
    orderBy: { date: "desc" },
  });
};
