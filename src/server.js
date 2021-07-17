const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// app.use(cors());
app.use(cors({ exposedHeaders: "*" })); //and this
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("PORT", process.env.PORT || 5000);

//Mongoose Connection
const uri = "mongodb://localhost/firstmongo";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

//Configure Router
const workshopRouter = require("./routes/workshopRouter");
app.use("/workshop", workshopRouter);

app.listen(app.get("PORT"), () =>
  console.log("Listening at " + app.get("PORT"))
);
