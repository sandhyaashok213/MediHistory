const {
  createPatient,
  findPatientByUserId,
  updatePatient,
} = require("../models/patientModel");

// =====================================
// Get Patient Profile
// =====================================

const getPatientProfile = (req, res) => {
  const userId = req.user.id;

  findPatientByUserId(userId, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.json({
        success: true,
        profile: null,
        message: "Patient profile not found",
      });
    }

    return res.json({
      success: true,
      profile: results[0],
    });
  });
};

// =====================================
// Create Patient Profile
// =====================================

const createPatientProfile = (req, res) => {
  const userId = req.user.id;

  const {
    dateOfBirth,
    gender,
    phone,
    address,
    emergencyContactName,
    emergencyContactPhone,
    bloodGroup,
  } = req.body;

  createPatient(
    userId,
    dateOfBirth,
    gender,
    phone,
    address,
    emergencyContactName,
    emergencyContactPhone,
    bloodGroup,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Failed to create patient profile",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Patient profile created successfully",
        patientId: result.insertId,
      });
    }
  );
};

// =====================================
// Update Patient Profile
// =====================================

const updatePatientProfile = (req, res) => {
  const userId = req.user.id;

  const {
    dateOfBirth,
    gender,
    phone,
    address,
    emergencyContactName,
    emergencyContactPhone,
    bloodGroup,
  } = req.body;

  updatePatient(
    userId,
    dateOfBirth,
    gender,
    phone,
    address,
    emergencyContactName,
    emergencyContactPhone,
    bloodGroup,
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Failed to update patient profile",
        });
      }

      return res.json({
        success: true,
        message: "Patient profile updated successfully",
      });
    }
  );
};

module.exports = {
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
};