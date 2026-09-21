const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const {
  createMedicalDocument,
  findDocumentsByPatientId,
  findDocumentById,
  deleteMedicalDocument,
  updateOCRText,
  updateAISummary,
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
// Upload Medical Document + OCR + AI
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

  console.log("Uploaded file:", filePath);

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

    // =====================================
    // Save Document in MySQL
    // =====================================

    createMedicalDocument(
      patientId,
      fileName,
      filePath,
      documentType,
      async (createError, result) => {
        if (createError) {
          console.error(createError);

          return res.status(500).json({
            success: false,
            message: "Failed to save medical document",
          });
        }

        const documentId = result.insertId;

        console.log(
          "Medical document saved. ID:",
          documentId
        );

        // =====================================
        // Send File to FastAPI OCR Service
        // =====================================

        try {
          console.log(
            "Sending file to OCR:",
            filePath
          );

          const formData = new FormData();

          formData.append(
            "file",
            fs.createReadStream(filePath)
          );

          const ocrResponse = await axios.post(
            "http://127.0.0.1:8000/ocr",
            formData,
            {
              headers: {
                ...formData.getHeaders(),
              },
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
            }
          );

          console.log(
            "OCR response received:",
            ocrResponse.data
          );

          const extractedText =
            ocrResponse.data.text || "";

          // =====================================
          // Save OCR Text in MySQL
          // =====================================

          updateOCRText(
            documentId,
            patientId,
            extractedText,
            "completed",
            async (updateError) => {
              if (updateError) {
                console.error(
                  "OCR database update error:",
                  updateError
                );

                return res.status(500).json({
                  success: false,
                  message:
                    "Document uploaded but OCR text could not be saved",
                });
              }

              console.log(
                "OCR text saved successfully"
              );

              // =====================================
              // Send OCR Text to AI Summary Service
              // =====================================

              try {
                console.log(
                  "Sending OCR text to AI Summary..."
                );

                const summaryResponse = await axios.post(
                  "http://127.0.0.1:8000/summarize",
                  {
                    text: extractedText,
                  }
                );

                console.log(
                  "AI Summary response received:",
                  summaryResponse.data
                );

                const aiSummary =
                  summaryResponse.data.summary || "";

                // =====================================
                // Save AI Summary in MySQL
                // =====================================

                updateAISummary(
                  documentId,
                  patientId,
                  aiSummary,
                  (summaryUpdateError) => {
                    if (summaryUpdateError) {
                      console.error(
                        "AI summary database update error:",
                        summaryUpdateError
                      );

                      return res.status(500).json({
                        success: false,
                        message:
                          "OCR completed but AI summary could not be saved",
                      });
                    }

                    console.log(
                      "AI summary saved successfully"
                    );

                    // =====================================
                    // Final Response
                    // =====================================

                    return res.status(201).json({
                      success: true,
                      message:
                        "Medical document uploaded, OCR completed and AI summary generated successfully",
                      documentId: documentId,
                      fileName: fileName,
                      ocrText: extractedText,
                      aiSummary: aiSummary,
                    });
                  }
                );
              } catch (summaryError) {
                console.error(
                  "AI summary service error:",
                  summaryError.message
                );

                return res.status(201).json({
                  success: true,
                  message:
                    "Medical document uploaded and OCR completed, but AI summary generation failed",
                  documentId: documentId,
                  fileName: fileName,
                  ocrText: extractedText,
                });
              }
            }
          );
        } catch (ocrError) {
          console.error(
            "OCR service error:",
            ocrError.message
          );

          // Update document status to failed
          updateOCRText(
            documentId,
            patientId,
            null,
            "failed",
            () => {
              return res.status(201).json({
                success: true,
                message:
                  "Medical document uploaded, but OCR processing failed",
                documentId: documentId,
                fileName: fileName,
              });
            }
          );
        }
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
          message:
            "Medical document deleted successfully",
        });
      }
    );
  });
};

// =====================================
// Export Functions
// =====================================

module.exports = {
  getDocuments,
  uploadDocument,
  getDocument,
  removeDocument,
};
