const multer = require("multer");
const path = require("path");

// Configure the storage engine for multer
const storage = multer.diskStorage({
  // Specify the directory where uploaded files will be stored
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads/' folder
  },
  // Specify the filename format for stored files
  filename: function (req, file, cb) {
    // Use the field name, current timestamp, and the original file extension
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Define a file filter function to validate uploaded files
const checkFileFilter = (req, file, cb) => {
  // Allow only files with MIME types that start with 'image'
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file and send an error message
    cb(new Error("Not an image! Please upload images only"));
  }
};

// Configure multer middleware with storage, file filter, and limits
module.exports = multer({
  storage: storage, // Use the configured storage engine
  fileFilter: checkFileFilter, // Apply the file filter function
  limits: {
    fileSize: 5 * 1024 * 1024, // Set a maximum file size limit of 5MB
  },
});
