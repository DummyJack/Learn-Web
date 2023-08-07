const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 255,
  },
  googleID: String,
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: String,
});

module.exports = mongoose.model("User", userSchema);
