const db = require("../config/db");

// =====================================
// Create Patient History
// =====================================

const createHistory = (
  patientId,
  chiefComplaint,
  historyOfPresentIllness,
  pastMedicalHistory,
  pastSurgicalHistory,
  personalHistory,
  familyHistory,
  reviewOfSystems,
  callback
) => {
  const sql = `
    INSERT INTO patient_history (
      patient_id,
      chief_complaint,
      history_of_present_illness,
      past_medical_history,
      past_surgical_history,
      personal_history,
      family_history,
      review_of_systems
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      chiefComplaint,
      historyOfPresentIllness,
      pastMedicalHistory,
      pastSurgicalHistory,
      personalHistory,
      familyHistory,
      reviewOfSystems,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Get Patient History
// =====================================

const findHistoryByPatientId = (patientId, callback) => {
  const sql = `
    SELECT *
    FROM patient_history
    WHERE patient_id = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(sql, [patientId], (err, results) => {
    callback(err, results);
  });
};

// =====================================
// Update Patient History
// =====================================

const updateHistory = (
  patientId,
  chiefComplaint,
  historyOfPresentIllness,
  pastMedicalHistory,
  pastSurgicalHistory,
  personalHistory,
  familyHistory,
  reviewOfSystems,
  callback
) => {
  const sql = `
    UPDATE patient_history
    SET
      chief_complaint = ?,
      history_of_present_illness = ?,
      past_medical_history = ?,
      past_surgical_history = ?,
      personal_history = ?,
      family_history = ?,
      review_of_systems = ?
    WHERE patient_id = ?
  `;

  db.query(
    sql,
    [
      chiefComplaint,
      historyOfPresentIllness,
      pastMedicalHistory,
      pastSurgicalHistory,
      personalHistory,
      familyHistory,
      reviewOfSystems,
      patientId,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

module.exports = {
  createHistory,
  findHistoryByPatientId,
  updateHistory,
};