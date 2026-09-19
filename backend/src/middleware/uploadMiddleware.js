
const multer = require("multer");
const path = require("path");

// =====================================
// Storage Configuration
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    callback(null, uniqueName);
  },
});

// =====================================
// File Type Validation
// =====================================

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only PDF, JPG, JPEG and PNG files are allowed"
      )
    );
  }
};

// =====================================
// Multer Upload
// =====================================

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;