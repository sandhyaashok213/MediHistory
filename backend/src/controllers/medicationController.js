const {
  createMedication,
  findMedicationsByPatientId,
  deleteMedication,
} = require("../models/medicationModel");

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
// Get Patient Medications
// =====================================

const getMedications = (req, res) => {
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

    findMedicationsByPatientId(
      patientId,
      (medicationError, results) => {
        if (medicationError) {
          console.error(medicationError);

          return res.status(500).json({
            success: false,
            message: "Failed to fetch medications",
          });
        }

        return res.json({
          success: true,
          medications: results,
        });
      }
    );
  });
};

// =====================================
// Add Medication
// =====================================

const addMedication = (req, res) => {
  const userId = req.user.id;

  const {
    medicationName,
    dosage,
    frequency,
    duration,
    reason,
  } = req.body;

  if (!medicationName) {
    return res.status(400).json({
      success: false,
      message: "Medication name is required",
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

    createMedication(
      patientId,
      medicationName,
      dosage,
      frequency,
      duration,
      reason,
      (createError, result) => {
        if (createError) {
          console.error(createError);

          return res.status(500).json({
            success: false,
            message: "Failed to add medication",
          });
        }

        return res.status(201).json({
          success: true,
          message: "Medication added successfully",
          medicationId: result.insertId,
        });
      }
    );
  });
};

// =====================================
// Delete Medication
// =====================================

const removeMedication = (req, res) => {
  const userId = req.user.id;

  const medicationId = req.params.id;

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

    deleteMedication(
      medicationId,
      patientId,
      (deleteError, result) => {
        if (deleteError) {
          console.error(deleteError);

          return res.status(500).json({
            success: false,
            message: "Failed to delete medication",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Medication not found",
          });
        }

        return res.json({
          success: true,
          message: "Medication deleted successfully",
        });
      }
    );
  });
};

module.exports = {
  getMedications,
  addMedication,
  removeMedication,
};