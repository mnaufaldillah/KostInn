if (process.env.NODE_ENV !== "development") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const router = require("./routes/index.js");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

module.exports = app;