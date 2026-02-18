const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const {
  createRecord,
  markAttendance,
  syncAttendance,
  getAttendanceByRecord,
  getRecordsByClassId,
} = require("../controllers/attendance.controller");

router.post("/create", authenticate, requireRole("TEACHER"), createRecord);
router.post("/mark", authenticate, requireRole("TEACHER"), markAttendance);
router.post("/sync", authenticate, requireRole("TEACHER"), syncAttendance);

router.get("/class/:classId", authenticate, requireRole("TEACHER"), getRecordsByClassId);

router.get("/:recordId", authenticate, requireRole("TEACHER"), getAttendanceByRecord);

module.exports = router;
