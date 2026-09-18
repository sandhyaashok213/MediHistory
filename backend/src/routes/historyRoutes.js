const express = require("express");

const {
  getHistory,
  createPatientHistory,
  updatePatientHistory,
} = require("../controllers/historyController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Get Patient History
// =====================================

router.get(
  "/history",
  authenticateToken,
  getHistory
);

// =====================================
// Create Patient History
// =====================================

router.post(
  "/history",
  authenticateToken,
  createPatientHistory
);

// =====================================
// Update Patient History
// =====================================

router.put(
  "/history",
  authenticateToken,
  updatePatientHistory
);

module.exports = router;