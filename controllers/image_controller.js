const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinary_helper");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    //Check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required, plase upload an image",
      });
    }

    //Upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //Store the image url and publicId along with uploaded userID in database
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const fetchImages = async (req, res) => {
  try {

    //Pagination config
    //Current page  or default 1
    const page = parseInt(req.query.page) || 1;
    //Limit of images per page
    const limit = parseInt(req.query.limit) || 5;
    //Amount of skipped images before rendering currents
    const skip = (page - 1) * limit;
    //Sort by => default time created
    const sortBy = req.query.sortBy || 'createdAt';
    //Sort order => default desc
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit)

    //Create empty object sortObj
    const sortObj = {};
    //Asignamos de manera dinamica la clave sortBy
    //el valor de dicha clave es sortOrder (1 or -1)
    //url example: ?sortBy=name&sortOrder=asc
    //code: sortObj["name"] = 1; <=> sortObj = { name: 1 };
    sortObj[sortBy] = sortOrder;

    //Usamos la config de pagination como parametros para los metodos de mongoose:
    //example url: localhost:3000/api/image/get?page=4&limit=3&sortBy=publicId&sortOrder=asc
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages,
        totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    //Loof for the image with the ID from de url
    const image = await Image.findById(imageId);
    //Check if image is DB
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found",
      });
    }

    //Check if the image was uploaded by the logged in user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized to delete this image, it was not uploaded by you.",
      });
    }

    //Delete this image from Cloudinary Storage
    await cloudinary.uploader.destroy(image.publicId);

    //Delete image from MongoDB
    await Image.findByIdAndDelete(imageId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

module.exports = { uploadImage, fetchImages, deleteImage };
