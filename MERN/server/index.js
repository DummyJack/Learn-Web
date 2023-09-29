const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// app
const app = express();

// routes
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;

// 連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// route
app.use("/api/user", authRoute);
// course route 應該被 jwt 保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為是 unauthorized
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
