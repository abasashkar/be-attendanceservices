const axios = require("axios");

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

exports.getTeachers = async (req, res) => {
  try {
    const search = req.query.search;
    const { data: teachers } = await axios.get(`${AUTH_SERVICE_URL}/internal/teachers`, {
      params: search != null ? { search } : {},
      timeout: 10000,
    });
    res.json(teachers);
  } catch (error) {
    if (error.response?.status === 500) {
      return res.status(502).json({
        message: "Failed to fetch teachers from auth service",
      });
    }
    console.error("getTeachers error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
