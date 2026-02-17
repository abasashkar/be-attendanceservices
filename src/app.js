const express = require("express");
const classRouter = require("./routes/class.routes");
const studentRouter = require("./routes/student.routes");
const attendanceRouter = require("./routes/attendance.routes");

const app = express();

app.use(express.json());

app.use("/classes", classRouter);
app.use("/students", studentRouter);
app.use("/attendance", attendanceRouter);
app.use('/internal', require('./routes/internal.routes'));


module.exports = app;
