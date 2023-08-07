const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 獲得所有學生資料
app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find({}).exec();
    return res.send(studentData);
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤");
  }
});

// 獲得特定學生資料
app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    return res.send(foundStudent);
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤");
  }
});

// 創建一個新學生
app.post("/students", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body;
    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save();
    return res.send({
      msg: "data save success",
      savedObject: saveStudent,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

// 更新特定學生資料，user 提供的資料會被變成 DB 內的完整新資料
app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
      // 因為 HTTP put request 要求客戶端提供所有數據，所以
      // 我們需要根據客戶端提供的數據，來更新 DB 內的資料
    );
    res.send({ msg: "success update data", updateData: newData });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

// 更新特定學生資料，user 只需要提供要被修改的資料即可

// class NewData {
//   constructor() {}
//   setProperty(key, value) {
//     if (key !== "merit" && key !== "other") {
//       this[key] == value;
//     } else {
//       this[`scholarship.${key}`] = value;
//     }
//   }
// }

app.patch("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    // let newObject = new NewData();
    // for (let property in req.body) {
    //   newObject.setProperty(property, req.body[property]);
    // }

    let newData = await Student.findByIdAndUpdate(
      { _id },
      {
        name,
        age,
        major,
        "scholarship.merit": merit,
        "scholarship.other": other,
      },
      // newObject,
      { new: true, runValidators: true }
      // 不能寫 overwrite: true
    );
    res.send({ msg: "success update data", updateData: newData });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

// 刪除學生資料
app.delete("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deleteResult = await Student.deleteOne({ _id });
    return res.send(deleteResult);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("server is running...");
});
