const express = require("express");

const {
  getAllergies,
  addAllergy,
  removeAllergy,
} = require("../controllers/allergyController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Get Patient Allergies
// =====================================

router.get(
  "/allergies",
  authenticateToken,
  getAllergies
);

// =====================================
// Add Allergy
// =====================================

router.post(
  "/allergies",
  authenticateToken,
  addAllergy
);

// =====================================
// Delete Allergy
// =====================================

router.delete(
  "/allergies/:id",
  authenticateToken,
  removeAllergy
);

module.exports = router;