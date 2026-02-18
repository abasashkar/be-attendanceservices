const studentService = require("../services/student.service");

exports.getStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const search = req.query.search;
    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }
    const students = await studentService.getStudentsByClass(classId, search);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name } = req.body;
    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    const student = await studentService.createStudent({
      name: name.trim(),
      classId,
    });
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
