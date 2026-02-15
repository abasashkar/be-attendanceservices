require("dotenv").config(); // load .env first
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ Attendance Service running on port ${PORT}`);
});

module.exports = app;