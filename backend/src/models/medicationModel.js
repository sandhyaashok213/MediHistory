const db = require("../config/db");

// =====================================
// Create Medication
// =====================================

const createMedication = (
  patientId,
  medicationName,
  dosage,
  frequency,
  duration,
  reason,
  callback
) => {
  const sql = `
    INSERT INTO medications (
      patient_id,
      medication_name,
      dosage,
      frequency,
      duration,
      reason
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patientId,
      medicationName,
      dosage,
      frequency,
      duration,
      reason,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// =====================================
// Get Patient Medications
// =====================================

const findMedicationsByPatientId = (
  patientId,
  callback
) => {
  const sql = `
    SELECT *
    FROM medications
    WHERE patient_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [patientId], (err, results) => {
    callback(err, results);
  });
};

// =====================================
// Delete Medication
// =====================================

const deleteMedication = (
  medicationId,
  patientId,
  callback
) => {
  const sql = `
    DELETE FROM medications
    WHERE id = ?
    AND patient_id = ?
  `;

  db.query(
    sql,
    [medicationId, patientId],
    (err, result) => {
      callback(err, result);
    }
  );
};

module.exports = {
  createMedication,
  findMedicationsByPatientId,
  deleteMedication,
};