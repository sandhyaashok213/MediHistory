
const {
  createMedicalDocument,
  findDocumentsByPatientId,
  findDocumentById,
  deleteMedicalDocument,
} = require("../models/medicalDocumentModel");

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
// Get Patient Documents
// =====================================

const getDocuments = (req, res) => {
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

    findDocumentsByPatientId(
      patientId,
      (documentError, results) => {
        if (documentError) {
          console.error(documentError);

          return res.status(500).json({
            success: false,
            message: "Failed to fetch medical documents",
          });
        }

        return res.json({
          success: true,
          documents: results,
        });
      }
    );
  });
};

// =====================================
// Upload Medical Document
// =====================================

const uploadDocument = (req, res) => {
  const userId = req.user.id;

  // Check whether a file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select a medical document",
    });
  }

  const {
    documentType,
  } = req.body;

  const fileName = req.file.originalname;
  const filePath = req.file.path;

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

    createMedicalDocument(
      patientId,
      fileName,
      filePath,
      documentType,
      (createError, result) => {
        if (createError) {
          console.error(createError);

          return res.status(500).json({
            success: false,
            message: "Failed to save medical document",
          });
        }

        return res.status(201).json({
          success: true,
          message: "Medical document uploaded successfully",
          documentId: result.insertId,
          fileName: fileName,
          filePath: filePath,
        });
      }
    );
  });
};

// =====================================
// Get One Medical Document
// =====================================

const getDocument = (req, res) => {
  const userId = req.user.id;

  const documentId = req.params.id;

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

    findDocumentById(
      documentId,
      patientId,
      (documentError, results) => {
        if (documentError) {
          console.error(documentError);

          return res.status(500).json({
            success: false,
            message: "Failed to fetch medical document",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Medical document not found",
          });
        }

        return res.json({
          success: true,
          document: results[0],
        });
      }
    );
  });
};

// =====================================
// Delete Medical Document
// =====================================

const removeDocument = (req, res) => {
  const userId = req.user.id;

  const documentId = req.params.id;

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

    deleteMedicalDocument(
      documentId,
      patientId,
      (deleteError, result) => {
        if (deleteError) {
          console.error(deleteError);

          return res.status(500).json({
            success: false,
            message: "Failed to delete medical document",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Medical document not found",
          });
        }

        return res.json({
          success: true,
          message: "Medical document deleted successfully",
        });
      }
    );
  });
};

module.exports = {
  getDocuments,
  uploadDocument,
  getDocument,
  removeDocument,
};