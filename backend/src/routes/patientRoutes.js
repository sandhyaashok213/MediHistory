const express = require("express");

const {
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
} = require("../controllers/patientController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get patient profile
router.get(
  "/profile",
  authenticateToken,
  getPatientProfile
);

// Create patient profile
router.post(
  "/profile",
  authenticateToken,
  createPatientProfile
);

// Update patient profile
router.put(
  "/profile",
  authenticateToken,
  updatePatientProfile
);

module.exports = router;