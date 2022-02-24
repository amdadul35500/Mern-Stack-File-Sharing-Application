const mongoose = require("mongoose");

const connectionDb = () => {
  // database connection
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("mongodb connection field.");
    });
};

module.exports = connectionDb;
