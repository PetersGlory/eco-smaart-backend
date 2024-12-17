const multer = require("multer");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

// Initialize Multer middleware
const maxSize = 6 * 1024 * 1024;
const uploadPics = multer({
  storage,
  limits: { fileSize: maxSize },
});

module.exports = uploadPics;
