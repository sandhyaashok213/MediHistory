const {
  createAllergy,
  findAllergiesByPatientId,
  deleteAllergy,
} = require("../models/allergyModel");

const {
  findPatientByUserId,
} = require("../models/patientModel");

// =====================================
// Get Patient ID
// =====================================

const getPatientId = (userId, callback) => {
  findPatientByUserId(userId, (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null);
    }

    callback(null, results[0].id);
  });
};

// =====================================
// Get Patient Allergies
// =====================================

const getAllergies = (req, res) => {
  const userId = req.user.id;

  getPatientId(userId, (err, patientId) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!patientId) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    findAllergiesByPatientId(
      patientId,
      (allergyError, results) => {
        if (allergyError) {
          console.error(allergyError);

          return res.status(500).json({
            success: false,
            message: "Failed to fetch allergies",
          });
        }

        return res.json({
          success: true,
          allergies: results,
        });
      }
    );
  });
};

// =====================================
// Add Allergy
// =====================================

const addAllergy = (req, res) => {
  const userId = req.user.id;

  const {
    allergen,
    reaction,
    severity,
  } = req.body;

  if (!allergen) {
    return res.status(400).json({
      success: false,
      message: "Allergen is required",
    });
  }

  getPatientId(userId, (err, patientId) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!patientId) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    createAllergy(
      patientId,
      allergen,
      reaction,
      severity,
      (createError, result) => {
        if (createError) {
          console.error(createError);

          return res.status(500).json({
            success: false,
            message: "Failed to add allergy",
          });
        }

        return res.status(201).json({
          success: true,
          message: "Allergy added successfully",
          allergyId: result.insertId,
        });
      }
    );
  });
};

// =====================================
// Delete Allergy
// =====================================

const removeAllergy = (req, res) => {
  const userId = req.user.id;

  const allergyId = req.params.id;

  getPatientId(userId, (err, patientId) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!patientId) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    deleteAllergy(
      allergyId,
      patientId,
      (deleteError, result) => {
        if (deleteError) {
          console.error(deleteError);

          return res.status(500).json({
            success: false,
            message: "Failed to delete allergy",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Allergy not found",
          });
        }

        return res.json({
          success: true,
          message: "Allergy deleted successfully",
        });
      }
    );
  });
};

module.exports = {
  getAllergies,
  addAllergy,
  removeAllergy,
};