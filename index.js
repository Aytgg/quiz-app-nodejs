const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Homepage!");
});

app.listen(process.env.PORT, () =>
  console.log("Listening on PORT: " + process.env.PORT),
);
