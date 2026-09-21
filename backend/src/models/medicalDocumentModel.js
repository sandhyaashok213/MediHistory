
const db = require("../config/db");

// =====================================
// Create Medical Document
// =====================================

const createMedicalDocument = (
  patientId,
  fileName,
  filePath,
  documentType,
  callback
) => {
  const sql = `
    INSERT INTO medical_documents (
      patient_id,
      file_name,
      file_path,
      document_type
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      fileName,
      filePath,
      documentType,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Get Patient Documents
// =====================================

const findDocumentsByPatientId = (
  patientId,
  callback
) => {
  const sql = `
    SELECT *
    FROM medical_documents
    WHERE patient_id = ?
    ORDER BY id DESC
  `;

  db.query(
    sql,
    [patientId],
    (err, results) => {
      callback(err, results);
    }
  );
};

// =====================================
// Get One Document
// =====================================

const findDocumentById = (
  documentId,
  patientId,
  callback
) => {
  const sql = `
    SELECT *
    FROM medical_documents
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [documentId, patientId],
    (err, results) => {
      callback(err, results);
    }
  );
};

// =====================================
// Delete Medical Document
// =====================================

const deleteMedicalDocument = (
  documentId,
  patientId,
  callback
) => {
  const sql = `
    DELETE FROM medical_documents
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [documentId, patientId],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Update OCR Text
// =====================================

const updateOCRText = (
  documentId,
  patientId,
  ocrText,
  processingStatus,
  callback
) => {
  const sql = `
    UPDATE medical_documents
    SET
      ocr_text = ?,
      processing_status = ?
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [
      ocrText,
      processingStatus,
      documentId,
      patientId,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Update AI Summary
// =====================================

const updateAISummary = (
  documentId,
  patientId,
  aiSummary,
  callback
) => {
  const sql = `
    UPDATE medical_documents
    SET
      ai_summary = ?
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [
      aiSummary,
      documentId,
      patientId,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Export Functions
// =====================================

module.exports = {
  createMedicalDocument,
  findDocumentsByPatientId,
  findDocumentById,
  deleteMedicalDocument,
  updateOCRText,
  updateAISummary,
};
