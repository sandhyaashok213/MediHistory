const db = require("../config/db");

// =====================================
// Create Allergy
// =====================================

const createAllergy = (
  patientId,
  allergen,
  reaction,
  severity,
  callback
) => {
  const sql = `
    INSERT INTO allergies (
      patient_id,
      allergen,
      reaction,
      severity
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      allergen,
      reaction,
      severity,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Get Patient Allergies
// =====================================

const findAllergiesByPatientId = (
  patientId,
  callback
) => {
  const sql = `
    SELECT *
    FROM allergies
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
// Delete Allergy
// =====================================

const deleteAllergy = (
  allergyId,
  patientId,
  callback
) => {
  const sql = `
    DELETE FROM allergies
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [allergyId, patientId],
    (err, result) => {
      callback(err, result);
    }
  );
};

module.exports = {
  createAllergy,
  findAllergiesByPatientId,
  deleteAllergy,
};