if (process.env.NODE_ENV !== "development") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const router = require("./routes/index.js");
const errorHandler = require("./middleware/errorHandler.js");
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(errorHandler);

module.exports = app;