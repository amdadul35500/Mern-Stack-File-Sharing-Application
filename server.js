const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectionDb = require("./config/db");
const filesRoute = require("./routes/files");
const showRoute = require("./routes/show");
const downloadRoute = require("./routes/download");

const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(express.static("public"));

connectionDb();

// set view engine
app.set("view engine", "ejs");

app.use("/api/files", filesRoute);
app.use("/files", showRoute);
app.use("/files/download", downloadRoute);

// home route
app.get("/", (req, res) => {
  res.render("upload");
});

// not foundHandler
app.use((req, res, next) => {
  res.status(404).send("Request url was not found !");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
