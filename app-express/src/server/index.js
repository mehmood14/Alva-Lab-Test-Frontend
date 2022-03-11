const http = require("http");

const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
let mongoose = require("mongoose");

//Database Connection
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = mongoose.connect(
  "mongodb://localhost:27017/transaction",
  options
);
mongo.then(
  () => {
    console.log("Database Connected...");
  },
  (error) => {
    console.log(error, "error");
  }
);

server.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("🚀 Server started on port " + PORT);
});
