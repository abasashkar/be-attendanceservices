const { getClassesByTeacher } = require("../services/class.service");

const getClasses = async (req, res) => {
  try {
    console.log("⚡ Controller: getClasses called for user", req.user);
    const teacherId = req.user.id;

    const classes = await getClassesByTeacher(teacherId);
    console.log("⚡ Classes fetched:", classes);

    res.json(classes);
  } catch (error) {
    console.error("⚠️ Error fetching classes:", error);
    res.status(500).json({ message: "Error fetching classes" });
  }
};

module.exports = { getClasses };
