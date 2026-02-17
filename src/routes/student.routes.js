const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { getStudents,createStudent} = require("../controllers/student.controller");

router.get("/:classId", authenticate, requireRole("TEACHER"), getStudents);

router.post(
    "/:classId",
    authenticate,
    requireRole("TEACHER"),
    createStudent
);

module.exports = router;
