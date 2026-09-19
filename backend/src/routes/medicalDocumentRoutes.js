
const express = require("express");

const {
  getDocuments,
  uploadDocument,
  getDocument,
  removeDocument,
} = require("../controllers/medicalDocumentController");

const authenticateToken = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =====================================
// Get all patient documents
// =====================================

router.get(
  "/documents",
  authenticateToken,
  getDocuments
);

// =====================================
// Upload medical document
// =====================================

router.post(
  "/documents",
  authenticateToken,
  upload.single("medicalDocument"),
  uploadDocument
);

// =====================================
// Get one medical document
// =====================================

router.get(
  "/documents/:id",
  authenticateToken,
  getDocument
);

// =====================================
// Delete medical document
// =====================================

router.delete(
  "/documents/:id",
  authenticateToken,
  removeDocument
);

module.exports = router;

