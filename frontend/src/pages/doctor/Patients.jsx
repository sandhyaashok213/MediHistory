
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load patients"
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
          <h2>Loading Patients...</h2>
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
            Patients
          </h1>

          <p style={styles.subtitle}>
            View and manage patient medical
            information.
          </p>
        </div>

        <button
          onClick={fetchPatients}
          style={styles.refreshButton}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Patient Count */}
      <div style={styles.countBox}>
        <strong>
          {patients.length}
        </strong>{" "}
        registered patient
        {patients.length !== 1 ? "s" : ""}
      </div>

      {/* Empty State */}
      {patients.length === 0 && !error && (
        <div style={styles.emptyBox}>
          <h2>No Patients Found</h2>

          <p>
            There are currently no registered
            patients.
          </p>
        </div>
      )}

      {/* Patient Cards */}
      <div style={styles.patientGrid}>
        {patients.map((patient) => (
          <div
            key={patient.user_id}
            style={styles.patientCard}
          >
            <div style={styles.patientHeader}>
              <div style={styles.avatar}>
                {patient.name
                  ? patient.name
                      .charAt(0)
                      .toUpperCase()
                  : "P"}
              </div>

              <div>
                <h2 style={styles.patientName}>
                  {patient.name}
                </h2>

                <p style={styles.patientRole}>
                  Patient
                </p>
              </div>
            </div>

            <hr />

            <div style={styles.info}>
              <p>
                <strong>Email:</strong>{" "}
                {patient.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {patient.phone ||
                  "Not provided"}
              </p>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <Link
                to={`/doctor/patients/${patient.id}`}
                style={styles.link}
              >
                <button style={styles.primaryButton}>
                  View Details
                </button>
              </Link>

              <Link
                to={`/doctor/patients/${patient.id}/history`}
                style={styles.link}
              >
                <button style={styles.secondaryButton}>
                  Medical History
                </button>
              </Link>

              <Link
                to={`/doctor/patients/${patient.id}/documents`}
                style={styles.link}
              >
                <button style={styles.secondaryButton}>
                  Documents
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Back */}
      <div style={styles.backSection}>
        <Link to="/doctor/dashboard">
          <button style={styles.backButton}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */

const styles = {
  page: {
    maxWidth: "1100px",
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
    fontSize: "16px",
  },

  refreshButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  errorBox: {
    padding: "12px 16px",
    marginBottom: "20px",
    borderRadius: "6px",
    backgroundColor: "#ffe5e5",
    color: "#b00020",
  },

  countBox: {
    padding: "15px 18px",
    marginBottom: "25px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    color: "#444",
  },

  emptyBox: {
    textAlign: "center",
    padding: "50px 20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },

  patientGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  patientCard: {
    padding: "22px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow:
      "0 3px 10px rgba(0, 0, 0, 0.07)",
  },

  patientHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    fontSize: "22px",
    fontWeight: "bold",
  },

  patientName: {
    margin: 0,
    fontSize: "21px",
  },

  patientRole: {
    margin: "5px 0 0 0",
    color: "#777",
    fontSize: "14px",
  },

  info: {
    marginTop: "15px",
    marginBottom: "20px",
    lineHeight: "1.6",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    textDecoration: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },

  secondaryButton: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  backSection: {
    marginTop: "30px",
  },

  backButton: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};

export default Patients;
