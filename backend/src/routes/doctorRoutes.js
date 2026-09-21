
const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// Doctor Dashboard
// =====================================

router.get(
  "/dashboard",
  authenticateToken,
  (req, res) => {
    const queries = {
      patients: `
        SELECT COUNT(DISTINCT users.id) AS count
        FROM users
        WHERE users.role = 'patient'
      `,

      medicalHistories: `
        SELECT COUNT(*) AS count
        FROM patient_history
      `,

      medicalDocuments: `
        SELECT COUNT(*) AS count
        FROM medical_documents
      `,

      pendingReviews: `
        SELECT COUNT(*) AS count
        FROM medical_documents
        WHERE ai_summary IS NOT NULL
        AND ai_summary != ''
        AND doctor_reviewed = 0
      `,
    };

    db.query(
      queries.patients,
      (patientsError, patientsResult) => {
        if (patientsError) {
          console.error(
            "Failed to count patients:",
            patientsError.message
          );

          return res.status(500).json({
            success: false,
            message: "Failed to load doctor dashboard",
          });
        }

        db.query(
          queries.medicalHistories,
          (historyError, historyResult) => {
            if (historyError) {
              console.error(
                "Failed to count medical histories:",
                historyError.message
              );

              return res.status(500).json({
                success: false,
                message: "Failed to load doctor dashboard",
              });
            }

            db.query(
              queries.medicalDocuments,
              (documentsError, documentsResult) => {
                if (documentsError) {
                  console.error(
                    "Failed to count medical documents:",
                    documentsError.message
                  );

                  return res.status(500).json({
                    success: false,
                    message: "Failed to load doctor dashboard",
                  });
                }

                db.query(
                  queries.pendingReviews,
                  (reviewsError, reviewsResult) => {
                    if (reviewsError) {
                      console.error(
                        "Failed to count pending reviews:",
                        reviewsError.message
                      );

                      return res.status(500).json({
                        success: false,
                        message:
                          "Failed to load doctor dashboard",
                      });
                    }

                    return res.json({
                      success: true,
                      dashboard: {
                        patients:
                          patientsResult[0].count,

                        medicalHistories:
                          historyResult[0].count,

                        medicalDocuments:
                          documentsResult[0].count,

                        pendingReviews:
                          reviewsResult[0].count,
                      },
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

// =====================================
// Get All Patients
// =====================================

router.get(
  "/patients",
  authenticateToken,
  (req, res) => {
    const sql = `
      SELECT
        MAX(patients.id) AS id,
        patients.user_id,
        users.name,
        users.email,
        MAX(patients.phone) AS phone
      FROM patients
      INNER JOIN users
        ON patients.user_id = users.id
      WHERE users.role = 'patient'
      GROUP BY
        patients.user_id,
        users.name,
        users.email
      ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Failed to fetch patients:",
          err.message
        );

        return res.status(500).json({
          success: false,
          message: "Failed to fetch patients",
        });
      }

      return res.json({
        success: true,
        patients: results,
      });
    });
  }
);

// =====================================
// Get Patient Details
// =====================================

router.get(
  "/patients/:id",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;

    const sql = `
      SELECT
        patients.id,
        patients.user_id,
        users.name,
        users.email,
        patients.date_of_birth,
        patients.gender,
        patients.phone,
        patients.address,
        patients.emergency_contact_name,
        patients.emergency_contact_phone,
        patients.blood_group
      FROM patients
      INNER JOIN users
        ON patients.user_id = users.id
      WHERE patients.id = ?
      AND users.role = 'patient'
      ORDER BY patients.id DESC
      LIMIT 1
    `;

    db.query(
      sql,
      [patientId],
      (err, results) => {
        if (err) {
          console.error(
            "Failed to fetch patient details:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message: "Failed to fetch patient details",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Patient not found",
          });
        }

        return res.json({
          success: true,
          patient: results[0],
        });
      }
    );
  }
);

// =====================================
// Get Patient Medical History
// =====================================

router.get(
  "/patients/:id/history",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;

    const sql = `
      SELECT
        patient_history.*
      FROM patient_history
      INNER JOIN patients
        ON patient_history.patient_id = patients.id
      INNER JOIN users
        ON patients.user_id = users.id
      WHERE users.id = (
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
      )
      AND users.role = 'patient'
      ORDER BY patient_history.id DESC
      LIMIT 1
    `;

    db.query(
      sql,
      [patientId],
      (err, results) => {
        if (err) {
          console.error(
            "Failed to fetch patient medical history:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to fetch patient medical history",
          });
        }

        if (results.length === 0) {
          return res.json({
            success: true,
            history: null,
          });
        }

        return res.json({
          success: true,
          history: results[0],
        });
      }
    );
  }
);

// =====================================
// Get Patient Medications
// =====================================

router.get(
  "/patients/:id/medications",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;

    const sql = `
      SELECT
        medications.id,
        medications.medication_name,
        medications.dosage,
        medications.frequency,
        medications.duration,
        medications.reason,
        medications.created_at
      FROM medications
      INNER JOIN patients
        ON medications.patient_id = patients.id
      INNER JOIN users
        ON patients.user_id = users.id
      WHERE users.id = (
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
      )
      AND users.role = 'patient'
      ORDER BY medications.id DESC
    `;

    db.query(
      sql,
      [patientId],
      (err, results) => {
        if (err) {
          console.error(
            "Failed to fetch patient medications:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to fetch patient medications",
          });
        }

        return res.json({
          success: true,
          medications: results,
        });
      }
    );
  }
);

// =====================================
// Get Patient Medical Documents
// =====================================

router.get(
  "/patients/:id/documents",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;

    const sql = `
      SELECT
        medical_documents.id,
        medical_documents.patient_id,
        medical_documents.file_name,
        medical_documents.file_path,
        medical_documents.document_type,
        medical_documents.upload_date,
        medical_documents.ocr_text,
        medical_documents.processing_status,
        medical_documents.ai_summary,
        medical_documents.doctor_reviewed,
        medical_documents.doctor_reviewed_at
      FROM medical_documents
      INNER JOIN patients
        ON medical_documents.patient_id = patients.id
      INNER JOIN users
        ON patients.user_id = users.id
      WHERE users.id = (
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
      )
      AND users.role = 'patient'
      ORDER BY medical_documents.id DESC
    `;

    db.query(
      sql,
      [patientId],
      (err, results) => {
        if (err) {
          console.error(
            "Failed to fetch patient medical documents:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to fetch patient medical documents",
          });
        }

        return res.json({
          success: true,
          documents: results,
        });
      }
    );
  }
);

// =====================================
// Confirm Patient Medical History
// =====================================

router.put(
  "/patients/:id/history/confirm",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;

    const sql = `
      UPDATE patient_history
      INNER JOIN patients
        ON patient_history.patient_id = patients.id
      INNER JOIN users
        ON patients.user_id = users.id
      SET
        patient_history.doctor_reviewed = 1,
        patient_history.doctor_reviewed_at = CURRENT_TIMESTAMP
      WHERE users.id = (
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
      )
      AND users.role = 'patient'
    `;

    db.query(
      sql,
      [patientId],
      (err, result) => {
        if (err) {
          console.error(
            "Failed to confirm patient medical history:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to confirm patient medical history",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message:
              "Patient medical history not found",
          });
        }

        return res.json({
          success: true,
          message:
            "Patient medical history confirmed successfully",
        });
      }
    );
  }
);

// =====================================
// Confirm AI Summary
// =====================================

router.put(
  "/patients/:id/documents/:documentId/confirm",
  authenticateToken,
  (req, res) => {
    const patientId = req.params.id;
    const documentId = req.params.documentId;

    const sql = `
      UPDATE medical_documents
      INNER JOIN patients
        ON medical_documents.patient_id = patients.id
      INNER JOIN users
        ON patients.user_id = users.id
      SET
        medical_documents.doctor_reviewed = 1,
        medical_documents.doctor_reviewed_at = CURRENT_TIMESTAMP
      WHERE medical_documents.id = ?
      AND users.id = (
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
      )
      AND users.role = 'patient'
    `;

    db.query(
      sql,
      [documentId, patientId],
      (err, result) => {
        if (err) {
          console.error(
            "Failed to confirm AI summary:",
            err.message
          );

          return res.status(500).json({
            success: false,
            message: "Failed to confirm AI summary",
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
          message: "AI summary confirmed successfully",
        });
      }
    );
  }
);

// =====================================
// Export Router
// =====================================

module.exports = router;
