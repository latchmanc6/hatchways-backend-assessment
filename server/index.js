const express = require("express");
const app = express();
const logger = require("./middleware/logger");

const port = 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routers
app.use("/api", require("./routes/blogRoutes"));

app
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
