const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "太老了"],
    min: [0, "年齡不能小於0"],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生的獎學金很多喔"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
