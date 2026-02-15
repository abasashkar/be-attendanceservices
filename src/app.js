const express = require("express");
const classRouter = require("./routes/class.routes");

const app = express();

app.use(express.json());
app.use("/classes", classRouter); // ✅ make sure this path matches

module.exports = app;