const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { getTeachers } = require("../controllers/teacher.controller");

router.get("/", authenticate, requireRole("ADMIN"), getTeachers);

module.exports = router;
