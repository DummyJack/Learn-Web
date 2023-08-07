const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");
const methodOverride = require("method-override");

// 連接 DB
mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => {
    console.log("success connect mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 獲得所有學生資料
app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find({}).exec();
    return res.render("students", { studentData });
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤");
  }
});

// 學生新增的表格
app.get("/students/new", async (req, res) => {
  return res.render("new_student_form");
});

// 獲得特定學生資料
app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("student_page", { foundStudent });
    } else {
      return res.status(400).render("error");
    }
  } catch (e) {
    return res.status(400).render("error");
  }
});

// 學生更新的表格
app.get("/students/:_id/edit", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("edit_student", { foundStudent });
    } else {
      return res.status(400).render("error");
    }
  } catch (e) {
    return res.status(400).render("error");
  }
});

// 新增學生
app.post("/students", async (req, res) => {
  try {
    let { name, age, merit, other } = req.body;
    let newStudent = new Student({
      name,
      age,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save();
    return res.render("success", { saveStudent });
  } catch (e) {
    return res.status(400).render("save_fail");
  }
});

// 更新學生資料
app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
    );
    return res.render("update_success", { newData });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

// // 刪除學生資料
// app.delete("/students/:_id", async (req, res) => {
//   try {
//     let { _id } = req.params;
//     let deleteResult = await Student.deleteOne({ _id });
//     return res.render("delete_success", { deleteResult });
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

app.listen(3000, () => {
  console.log("server is running...");
});
