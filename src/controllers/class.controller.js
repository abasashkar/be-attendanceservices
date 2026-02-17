const classService = require("../services/class.service");

exports.getClasses = async (req, res) => {
  const teacherId = req.user.id;   // 🔥 get from JWT

  const classes = await classService.getClassesByTeacher(teacherId);

  res.json(classes);
};

exports.createClassByAdmin = async (req, res) => {
  try {
    const { name, teacherId } = req.body;

    const newClass = await classService.createClass({
      name,
      teacherId,
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error });
  }
};

