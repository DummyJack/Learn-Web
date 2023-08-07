const router = require("express").Router();

// 檢查是否有登入
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/google"); // 沒登入，重新導向到登入介面
  }
};

router.get("/", authCheck, async (req, res) => {
  return res.render("profile", { user: req.user }); // deserializeUser()
});

module.exports = router;
