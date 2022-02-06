const app = require("./index");
const port = 3000;

app
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
