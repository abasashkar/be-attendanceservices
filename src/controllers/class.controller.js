const classService = require("../services/class.service");

exports.getClasses = async (req, res) => {
  const search = req.query.search;
  if (req.user.role === "ADMIN") {
    const classes = await classService.getAllClasses(search);
    return res.json(classes);
  }
  const classes = await classService.getClassesByTeacher(req.user.id, search);
  res.json(classes);
};

exports.createClassByAdmin = async (req, res) => {
  try {
    const { name, teacherId } = req.body;

    if (!name || !teacherId) {
      return res.status(400).json({
        error: "Missing required fields",
        details: !name ? "name is required" : "teacherId is required",
      });
    }

    const newClass = await classService.createClass({
      name,
      teacherId,
    });

    res.status(201).json(newClass);
  } catch (error) {
    if (error.code === "TEACHER_NOT_FOUND") {
      return res.status(404).json({ error: "Teacher not found", teacherId: req.body.teacherId });
    }
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message || "Failed to create class" });
  }
};

