const attendanceService = require("../services/attendance.service");

exports.createRecord = async (req, res) => {
  try {
    const record = await attendanceService.createRecord(req.body);
    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const entry = await attendanceService.markAttendance(req.body);
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.syncAttendance = async (req, res) => {
  try {
    const result = await attendanceService.syncAttendance(req.body);
    res.json(result);
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAttendanceByRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const entries = await attendanceService.getAttendanceByRecord(recordId);
    const studentsAttendance = entries.map((entry) => ({
      student: entry.student,
      status: entry.status,
    }));
    res.json(studentsAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRecordsByClassId = async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ error: "classId is required", records: [] });
    }
    const records = await attendanceService.getRecordsByClassId(classId);
    console.log("[getRecordsByClassId] classId:", classId, "count:", records.length);
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
