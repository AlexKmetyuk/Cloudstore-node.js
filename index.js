const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const fileRouter = require("./routes/filesRouter");
const categoriesRouter = require("./routes/categoriesRoute");
const { errorHandler } = require("./helpers/apiHelpers");
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/files", fileRouter);
app.use("/api/categories", categoriesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    //db
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL, () => {
      console.log("Data base connect successfully");
    });
    //server
    app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
