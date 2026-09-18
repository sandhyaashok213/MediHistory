const db = require("../config/db");

// Create patient profile
const createPatient = (
  userId,
  dateOfBirth,
  gender,
  phone,
  address,
  emergencyContactName,
  emergencyContactPhone,
  bloodGroup,
  callback
) => {
  const sql = `
    INSERT INTO patients (
      user_id,
      date_of_birth,
      gender,
      phone,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      blood_group
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      dateOfBirth,
      gender,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodGroup,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

// Find patient by user ID
const findPatientByUserId = (userId, callback) => {
  const sql = `
    SELECT *
    FROM patients
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    callback(err, results);
  });
};

// Update patient profile
const updatePatient = (
  userId,
  dateOfBirth,
  gender,
  phone,
  address,
  emergencyContactName,
  emergencyContactPhone,
  bloodGroup,
  callback
) => {
  const sql = `
    UPDATE patients
    SET
      date_of_birth = ?,
      gender = ?,
      phone = ?,
      address = ?,
      emergency_contact_name = ?,
      emergency_contact_phone = ?,
      blood_group = ?
    WHERE user_id = ?
  `;

  db.query(
    sql,
    [
      dateOfBirth,
      gender,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodGroup,
      userId,
    ],
    (err, result) => {
      callback(err, result);
    }
  );
};

module.exports = {
  createPatient,
  findPatientByUserId,
  updatePatient,
};