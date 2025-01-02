const express = require("express");
const authMiddleware = require("../middlewares/auth_middleware");
const adminMiddleware = require("../middlewares/admin_middleware");
const uploadImageMiddleware = require("../middlewares/uploadImage_middleware");
const { uploadImage, fetchImages, deleteImage } = require("../controllers/image_controller");

const router = express.Router();

//upload image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadImageMiddleware.single("image"),
  uploadImage
);

//get all images
router.get("/get", authMiddleware, fetchImages);

//delete image
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteImage);


module.exports = router;