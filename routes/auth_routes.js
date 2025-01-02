const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/auth_controller");
const authMiddleware = require("../middlewares/auth_middleware");

const router = express.Router();

//All routes realted to authentication and authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", authMiddleware, changePassword);
module.exports = router;