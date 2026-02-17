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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAttendanceByRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const entries = await attendanceService.getAttendanceByRecord(recordId);
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
