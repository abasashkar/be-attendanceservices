const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { getClasses, createClassByAdmin } = require("../controllers/class.controller");

router.get("/", authenticate,requireRole("TEACHER"), getClasses);
router.post(
  "/test",
  authenticate,
  requireRole("ADMIN"),
  createClassByAdmin
);


module.exports = router;
