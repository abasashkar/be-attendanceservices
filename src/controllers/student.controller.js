const studentService = require("../services/student.service");

exports.getStudents = async (req, res) => {
  const { classId } = req.params;
  const students = await studentService.getStudentsByClass(classId);
  res.json(students);
};
exports.createStudent = async (req, res) => {
  const { classId } = req.params;
  const { name } = req.body;

  const student = await studentService.createStudent({
    name,
    classId
  });

  res.json(student);
};
