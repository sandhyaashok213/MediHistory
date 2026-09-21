import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PatientMedications() {
  const { id } = useParams();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedications();
  }, [id]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/doctor/patients/${id}/medications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMedications(
        response.data.medications || []
      );
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load medications"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          <h2>Loading Medications...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Patient Medications
          </h1>

          <p style={styles.subtitle}>
            View medications recorded for this
            patient.
          </p>
        </div>

        <Link to={`/doctor/patients/${id}`}>
          <button style={styles.backButton}>
            ← Patient Details
          </button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Medication Count */}
      <div style={styles.countBox}>
        <strong>
          {medications.length}
        </strong>{" "}
        medication
        {medications.length !== 1 ? "s" : ""}{" "}
        recorded
      </div>

      {/* Empty State */}
      {medications.length === 0 && !error && (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>
            💊
          </div>

          <h2>No Medications Found</h2>

          <p>
            There are no medications recorded
            for this patient.
          </p>
        </div>
      )}

      {/* Medication Cards */}
      {medications.length > 0 && (
        <div style={styles.medicationGrid}>
          {medications.map((medication) => (
            <div
              key={medication.id}
              style={styles.medicationCard}
            >
              <div style={styles.cardHeader}>
                <div style={styles.icon}>
                  💊
                </div>

                <div>
                  <h2
                    style={styles.medicationName}
                  >
                    {medication.medication_name ||
                      "Medication"}
                  </h2>

                  <p style={styles.createdDate}>
                    Added:{" "}
                    {medication.created_at
                      ? new Date(
                          medication.created_at
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              <hr />

              <div style={styles.details}>
                <MedicationItem
                  label="Dosage"
                  value={
                    medication.dosage ||
                    "Not provided"
                  }
                />

                <MedicationItem
                  label="Frequency"
                  value={
                    medication.frequency ||
                    "Not provided"
                  }
                />

                <MedicationItem
                  label="Duration"
                  value={
                    medication.duration ||
                    "Not provided"
                  }
                />

                <MedicationItem
                  label="Reason"
                  value={
                    medication.reason ||
                    "Not provided"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div style={styles.navigation}>
        <Link to={`/doctor/patients/${id}`}>
          <button style={styles.backButton}>
            ← Patient Details
          </button>
        </Link>

        <Link
          to={`/doctor/patients/${id}/history`}
        >
          <button style={styles.secondaryButton}>
            ← Medical History
          </button>
        </Link>

        <Link
          to={`/doctor/patients/${id}/documents`}
        >
          <button style={styles.secondaryButton}>
            Medical Documents →
          </button>
        </Link>
      </div>
    </div>
  );
}

/* =========================
   Medication Item
========================= */

function MedicationItem({ label, value }) {
  return (
    <div style={styles.detailItem}>
      <p style={styles.label}>
        {label}
      </p>

      <p style={styles.value}>
        {value}
      </p>
    </div>
  );
}

/* =========================
   Styles
========================= */

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
  },

  loading: {
    textAlign: "center",
    padding: "60px 20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  title: {
    margin: "0 0 8px 0",
    fontSize: "32px",
  },

  subtitle: {
    margin: 0,
    color: "#666",
  },

  countBox: {
    padding: "15px 18px",
    marginBottom: "25px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    color: "#444",
  },

  medicationGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  medicationCard: {
    padding: "22px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    boxShadow:
      "0 3px 10px rgba(0, 0, 0, 0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  icon: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#f3f3f3",
    fontSize: "24px",
  },

  medicationName: {
    margin: 0,
    fontSize: "20px",
  },

  createdDate: {
    margin: "5px 0 0 0",
    color: "#777",
    fontSize: "13px",
  },

  details: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  detailItem: {
    padding: "12px",
    borderRadius: "7px",
    backgroundColor: "#f8f8f8",
  },

  label: {
    margin: "0 0 5px 0",
    color: "#777",
    fontSize: "13px",
  },

  value: {
    margin: 0,
    fontWeight: "bold",
    wordBreak: "break-word",
  },

  emptyBox: {
    padding: "50px 20px",
    textAlign: "center",
    borderRadius: "10px",
    backgroundColor: "#f8f8f8",
    color: "#666",
  },

  emptyIcon: {
    fontSize: "40px",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "30px",
    marginBottom: "30px",
  },

  backButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  errorBox: {
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#ffe5e5",
    color: "#b00020",
  },
};

export default PatientMedications;
