const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("./config/passport");

// Routes
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");

// app
const app = express();

// 連接 MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => {
    console.log("Connecting to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

// 排版引擎
app.set("view engine", "ejs");

// MiddLewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 設定 routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Server running on port 8080.");
});
