
require('dotenv').config();

const express = require('express');


const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Attendance Service running on ${PORT}`);
});
