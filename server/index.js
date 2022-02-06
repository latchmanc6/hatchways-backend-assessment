const express = require("express");
const app = express();
const logger = require("./middleware/logger");

// Middleware
app.use(express.json());
app.use(logger);

// Routers
app.use("/api", require("./routes/blogRoutes"));

module.exports = app;