const express = require("express");
const router = express.Router();
const { getClasses } = require("../controllers/class.controller");
const authenticate = require("../middlewares/auth.middleware");

router.get("/", authenticate, getClasses);

module.exports = router;
