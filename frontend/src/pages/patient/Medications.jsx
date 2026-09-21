import { useState, useEffect } from "react";
import axios from "axios";

function Medications() {
  const [medications, setMedications] = useState([]);

  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/medications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMedications(response.data.medications || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load medications"
        );
      } else {
        setError("Unable to load medications");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/patient/medications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Medication added successfully."
      );

      setFormData({
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        reason: "",
      });

      fetchMedications();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to add medication"
        );
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/patient/medications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Medication deleted successfully."
      );

      fetchMedications();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to delete medication"
        );
      } else {
        setError("Unable to delete medication");
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>💊</div>
          <h2 style={styles.loadingTitle}>
            Loading Medications
          </h2>
          <p style={styles.loadingText}>
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <section style={styles.header}>
          <div>
            <p style={styles.headerLabel}>
              PATIENT PORTAL
            </p>

            <h1 style={styles.headerTitle}>
              My Medications
            </h1>

            <p style={styles.headerSubtitle}>
              Add and manage your current medications securely.
            </p>
          </div>

          <div style={styles.headerIcon}>
            💊
          </div>
        </section>

        {message && (
          <div style={styles.successMessage}>
            <span style={styles.messageIcon}>
              ✓
            </span>

            <div>
              <strong>Success</strong>
              <p>{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.messageIcon}>
              ⚠️
            </span>

            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section style={styles.formCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Add Medication
              </h2>

              <p style={styles.sectionSubtitle}>
                Enter the details of your medication below.
              </p>
            </div>

            <div style={styles.formIcon}>
              ➕
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>

              <div style={styles.field}>
                <label style={styles.label}>
                  💊 Medication Name
                </label>

                <input
                  type="text"
                  name="medicationName"
                  placeholder="Enter medication name"
                  value={formData.medicationName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  ⚖️ Dosage
                </label>

                <input
                  type="text"
                  name="dosage"
                  placeholder="Example: 500 mg"
                  value={formData.dosage}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  🕒 Frequency
                </label>

                <input
                  type="text"
                  name="frequency"
                  placeholder="Example: Twice a day"
                  value={formData.frequency}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  📅 Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  placeholder="Example: 5 days"
                  value={formData.duration}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldFull}>
                <label style={styles.label}>
                  📝 Reason
                </label>

                <textarea
                  name="reason"
                  placeholder="Why are you taking this medication?"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  style={styles.textarea}
                />
              </div>

            </div>

            <div style={styles.formFooter}>
              <div style={styles.securityText}>
                🔒 Your medication information is securely stored.
              </div>

              <button
                type="submit"
                style={styles.addButton}
              >
                ➕ Add Medication
              </button>
            </div>
          </form>
        </section>

        <section style={styles.medicationsSection}>

          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Current Medications
              </h2>

              <p style={styles.sectionSubtitle}>
                Your currently recorded medications.
              </p>
            </div>

            <div style={styles.countBadge}>
              {medications.length}{" "}
              {medications.length === 1
                ? "Medication"
                : "Medications"}
            </div>
          </div>

          {medications.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIcon}>
                💊
              </div>

              <h3 style={styles.emptyTitle}>
                No Medications Added
              </h3>

              <p style={styles.emptyText}>
                You have not added any medications yet.
                Use the form above to add one.
              </p>
            </div>
          ) : (
            <div style={styles.medicationGrid}>
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  style={styles.medicationCard}
                >
                  <div style={styles.medicationTop}>
                    <div style={styles.medicationIcon}>
                      💊
                    </div>

                    <div style={styles.medicationNameArea}>
                      <h3 style={styles.medicationName}>
                        {medication.medication_name}
                      </h3>

                      <span style={styles.activeBadge}>
                        Active Medication
                      </span>
                    </div>
                  </div>

                  <div style={styles.detailsGrid}>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Dosage
                      </span>

                      <strong style={styles.detailValue}>
                        {medication.dosage ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Frequency
                      </span>

                      <strong style={styles.detailValue}>
                        {medication.frequency ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Duration
                      </span>

                      <strong style={styles.detailValue}>
                        {medication.duration ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Reason
                      </span>

                      <strong style={styles.detailValue}>
                        {medication.reason ||
                          "Not provided"}
                      </strong>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(medication.id)
                    }
                    style={styles.deleteButton}
                  >
                    🗑️ Delete Medication
                  </button>
                </div>
              ))}
            </div>
          )}

        </section>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            ℹ️
          </div>

          <div>
            <h3 style={styles.infoTitle}>
              Medication Safety
            </h3>

            <p style={styles.infoText}>
              Keep your medication information updated and
              inform your doctor about any changes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background: "#f5f8fc",
    padding: "40px 6%",
    color: "#1f2937",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    borderRadius: "20px",
    padding: "35px 40px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    boxShadow:
      "0 10px 30px rgba(15, 118, 110, 0.18)",
  },

  headerLabel: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    opacity: 0.85,
    marginBottom: "8px",
  },

  headerTitle: {
    fontSize: "32px",
    margin: "0 0 8px",
  },

  headerSubtitle: {
    margin: 0,
    fontSize: "15px",
    opacity: 0.9,
  },

  headerIcon: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    flexShrink: 0,
  },

  successMessage: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    borderRadius: "14px",
    padding: "15px 20px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  errorMessage: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "14px",
    padding: "15px 20px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  messageIcon: {
    fontSize: "18px",
    fontWeight: "700",
  },

  formCard: {
    background: "white",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    padding: "30px",
    marginBottom: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  },

  sectionTitle: {
    margin: "0 0 5px",
    fontSize: "22px",
    color: "#111827",
  },

  sectionSubtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  formIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "22px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
  },

  label: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "13px 14px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1f2937",
    background: "#fafafa",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "13px 14px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1f2937",
    background: "#fafafa",
    outline: "none",
    resize: "vertical",
  },

  formFooter: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  securityText: {
    color: "#6b7280",
    fontSize: "12px",
  },

  addButton: {
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 15px rgba(15,118,110,0.2)",
  },

  medicationsSection: {
    marginBottom: "30px",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  countBadge: {
    background: "#ecfdf5",
    color: "#047857",
    borderRadius: "20px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "700",
  },

  medicationGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  medicationCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "23px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
  },

  medicationTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "22px",
  },

  medicationIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  medicationNameArea: {
    flex: 1,
  },

  medicationName: {
    margin: "0 0 7px",
    fontSize: "18px",
    color: "#111827",
  },

  activeBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "20px",
    padding: "4px 9px",
    fontSize: "10px",
    fontWeight: "700",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },

  detailItem: {
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "12px",
    minWidth: 0,
  },

  detailLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "11px",
    marginBottom: "5px",
    fontWeight: "600",
  },

  detailValue: {
    display: "block",
    color: "#374151",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  deleteButton: {
    width: "100%",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    background: "#fff",
    color: "#dc2626",
    padding: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "50px 25px",
    textAlign: "center",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.03)",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#374151",
    fontSize: "18px",
  },

  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  infoCard: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "15px",
    padding: "20px 23px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },

  infoIcon: {
    fontSize: "21px",
  },

  infoTitle: {
    margin: "0 0 5px",
    color: "#1e40af",
    fontSize: "15px",
  },

  infoText: {
    margin: 0,
    color: "#1d4ed8",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  loadingPage: {
    minHeight: "calc(100vh - 70px)",
    background: "#f5f8fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingCard: {
    background: "white",
    padding: "40px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.06)",
  },

  loadingIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  loadingTitle: {
    margin: "0 0 5px",
    color: "#111827",
  },

  loadingText: {
    margin: 0,
    color: "#6b7280",
  },
};

export default Medications;