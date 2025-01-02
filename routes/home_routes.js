const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {

  //Tomamos las propiedades de userInfo (creado en authmiddleware)
  const { userId, username, role } = req.userInfo;

  //Pasamos la informacion obetnida al frontend
  res.json({
    message: "Welcome to the home page",
    user: {
      userId,
      username,
      role,
    },
  });
});

module.exports = router;
