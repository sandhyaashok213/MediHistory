const {
  createHistory,
  findHistoryByPatientId,
  updateHistory,
} = require("../models/historyModel");

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
// Get Patient History
// =====================================

const getHistory = (req, res) => {
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

    findHistoryByPatientId(
      patientId,
      (historyError, results) => {
        if (historyError) {
          console.error(historyError);

          return res.status(500).json({
            success: false,
            message: "Failed to fetch patient history",
          });
        }

        if (results.length === 0) {
          return res.json({
            success: true,
            history: null,
            message: "Patient history not found",
          });
        }

        return res.json({
          success: true,
          history: results[0],
        });
      }
    );
  });
};

// =====================================
// Create Patient History
// =====================================

const createPatientHistory = (req, res) => {
  const userId = req.user.id;

  const {
    chiefComplaint,
    historyOfPresentIllness,
    pastMedicalHistory,
    pastSurgicalHistory,
    personalHistory,
    familyHistory,
    reviewOfSystems,
  } = req.body;

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

    createHistory(
      patientId,
      chiefComplaint,
      historyOfPresentIllness,
      pastMedicalHistory,
      pastSurgicalHistory,
      personalHistory,
      familyHistory,
      reviewOfSystems,
      (createError, result) => {
        if (createError) {
          console.error(createError);

          return res.status(500).json({
            success: false,
            message: "Failed to create patient history",
          });
        }

        return res.status(201).json({
          success: true,
          message: "Patient history created successfully",
          historyId: result.insertId,
        });
      }
    );
  });
};

// =====================================
// Update Patient History
// =====================================

const updatePatientHistory = (req, res) => {
  const userId = req.user.id;

  const {
    chiefComplaint,
    historyOfPresentIllness,
    pastMedicalHistory,
    pastSurgicalHistory,
    personalHistory,
    familyHistory,
    reviewOfSystems,
  } = req.body;

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

    updateHistory(
      patientId,
      chiefComplaint,
      historyOfPresentIllness,
      pastMedicalHistory,
      pastSurgicalHistory,
      personalHistory,
      familyHistory,
      reviewOfSystems,
      (updateError, result) => {
        if (updateError) {
          console.error(updateError);

          return res.status(500).json({
            success: false,
            message: "Failed to update patient history",
          });
        }

        return res.json({
          success: true,
          message: "Patient history updated successfully",
        });
      }
    );
  });
};

module.exports = {
  getHistory,
  createPatientHistory,
  updatePatientHistory,
};