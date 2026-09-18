const express = require("express");

const {
  getMedications,
  addMedication,
  removeMedication,
} = require("../controllers/medicationController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Get Patient Medications
// =====================================

router.get(
  "/medications",
  authenticateToken,
  getMedications
);

// =====================================
// Add Medication
// =====================================

router.post(
  "/medications",
  authenticateToken,
  addMedication
);

// =====================================
// Delete Medication
// =====================================

router.delete(
  "/medications/:id",
  authenticateToken,
  removeMedication
);

module.exports = router;