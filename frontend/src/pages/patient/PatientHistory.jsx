import { useState, useEffect } from "react";
import axios from "axios";

function PatientHistory() {
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    pastMedicalHistory: "",
    pastSurgicalHistory: "",
    personalHistory: "",
    familyHistory: "",
    reviewOfSystems: "",
  });

  const [historyExists, setHistoryExists] = useState(false);
  const [doctorReviewed, setDoctorReviewed] = useState(false);
  const [doctorReviewedAt, setDoctorReviewedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/patient/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.history) {
          setHistoryExists(true);

          const history = response.data.history;

          setFormData({
            chiefComplaint: history.chief_complaint || "",
            historyOfPresentIllness:
              history.history_of_present_illness || "",
            pastMedicalHistory:
              history.past_medical_history || "",
            pastSurgicalHistory:
              history.past_surgical_history || "",
            personalHistory:
              history.personal_history || "",
            familyHistory:
              history.family_history || "",
            reviewOfSystems:
              history.review_of_systems || "",
          });

          setDoctorReviewed(history.doctor_reviewed === 1);

          setDoctorReviewedAt(
            history.doctor_reviewed_at || null
          );
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(
            error.response.data.message ||
              "Unable to load patient history"
          );
        } else {
          setError("Unable to load patient history");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (doctorReviewed) {
      setDoctorReviewed(false);
      setDoctorReviewedAt(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: historyExists ? "put" : "post",
        url: "http://localhost:5000/api/patient/history",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(
        response.data.message ||
          "Medical history saved successfully."
      );

      setHistoryExists(true);
      setDoctorReviewed(false);
      setDoctorReviewedAt(null);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to save medical history"
        );
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}>⏳</div>
          <h2>Loading Medical History</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  const fields = [
    {
      name: "chiefComplaint",
      title: "Chief Complaint",
      icon: "🩺",
      placeholder:
        "What is your main health problem?",
      rows: 4,
    },
    {
      name: "historyOfPresentIllness",
      title: "History of Present Illness",
      icon: "📋",
      placeholder:
        "Describe your current health problem, when it started, symptoms, etc.",
      rows: 5,
    },
    {
      name: "pastMedicalHistory",
      title: "Past Medical History",
      icon: "🏥",
      placeholder:
        "Mention previous illnesses, diseases, conditions, etc.",
      rows: 5,
    },
    {
      name: "pastSurgicalHistory",
      title: "Past Surgical History",
      icon: "⚕️",
      placeholder:
        "Mention previous surgeries or operations.",
      rows: 5,
    },
    {
      name: "personalHistory",
      title: "Personal History",
      icon: "👤",
      placeholder:
        "Mention lifestyle, food habits, sleep, smoking, alcohol, etc.",
      rows: 5,
    },
    {
      name: "familyHistory",
      title: "Family History",
      icon: "👨‍👩‍👧",
      placeholder:
        "Mention diseases or medical conditions in your family.",
      rows: 5,
    },
    {
      name: "reviewOfSystems",
      title: "Review of Systems",
      icon: "🔎",
      placeholder:
        "Mention other symptoms or health problems affecting different body systems.",
      rows: 5,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <div style={styles.headerLabel}>
              PATIENT PORTAL
            </div>

            <h1 style={styles.headerTitle}>
              My Medical History
            </h1>

            <p style={styles.headerSubtitle}>
              Keep your medical information updated for your healthcare team.
            </p>
          </div>

          <div style={styles.headerIcon}>
            📋
          </div>
        </div>

        {message && (
          <div style={styles.successMessage}>
            <span>✓</span>
            <div>
              <strong>Success</strong>
              <p>{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <span>⚠️</span>
            <div>
              <strong>Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div style={styles.reviewCard}>
          <div style={styles.reviewIcon}>
            {doctorReviewed ? "✓" : "🕐"}
          </div>

          <div style={styles.reviewContent}>
            <h2 style={styles.reviewTitle}>
              Doctor Review
            </h2>

            {doctorReviewed ? (
              <>
                <p style={styles.reviewSuccess}>
                  History Reviewed and Confirmed
                </p>

                <p style={styles.reviewDate}>
                  <strong>Confirmed At:</strong>{" "}
                  {doctorReviewedAt
                    ? new Date(
                        doctorReviewedAt
                      ).toLocaleString()
                    : "Not available"}
                </p>
              </>
            ) : (
              <p style={styles.reviewWaiting}>
                Your medical history is waiting for doctor review.
              </p>
            )}
          </div>

          <div
            style={
              doctorReviewed
                ? styles.statusConfirmed
                : styles.statusPending
            }
          >
            {doctorReviewed
              ? "Confirmed"
              : "Pending Review"}
          </div>
        </div>

        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div>
              <h2 style={styles.formTitle}>
                Medical Information
              </h2>

              <p style={styles.formSubtitle}>
                Please provide accurate information about your health.
              </p>
            </div>

            <span style={styles.requiredText}>
              All information is private
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {fields.map((field) => (
                <div
                  key={field.name}
                  style={
                    field.name === "chiefComplaint"
                      ? styles.fieldFull
                      : styles.field
                  }
                >
                  <label style={styles.label}>
                    <span style={styles.fieldIcon}>
                      {field.icon}
                    </span>

                    {field.title}
                  </label>

                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows={field.rows}
                    style={styles.textarea}
                  />
                </div>
              ))}
            </div>

            <div style={styles.formFooter}>
              <div style={styles.footerInfo}>
                🔒 Your information is securely stored.
              </div>

              <button
                type="submit"
                style={styles.saveButton}
              >
                💾 Save Medical History
              </button>
            </div>
          </form>
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

  reviewCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px 25px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
  },

  reviewIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#ecfdf5",
    color: "#047857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  reviewContent: {
    flex: 1,
  },

  reviewTitle: {
    margin: "0 0 5px",
    fontSize: "17px",
    color: "#111827",
  },

  reviewSuccess: {
    margin: "0 0 4px",
    color: "#047857",
    fontSize: "14px",
    fontWeight: "600",
  },

  reviewWaiting: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  reviewDate: {
    margin: 0,
    color: "#6b7280",
    fontSize: "12px",
  },

  statusConfirmed: {
    background: "#dcfce7",
    color: "#166534",
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  statusPending: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  formCard: {
    background: "white",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  },

  formTitle: {
    margin: "0 0 5px",
    fontSize: "22px",
    color: "#111827",
  },

  formSubtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  requiredText: {
    fontSize: "12px",
    color: "#0f766e",
    background: "#ecfdf5",
    padding: "8px 12px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
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
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "9px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
  },

  fieldIcon: {
    fontSize: "17px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "11px",
    padding: "13px 14px",
    fontSize: "14px",
    fontFamily: "inherit",
    lineHeight: "1.5",
    color: "#1f2937",
    background: "#fafafa",
    outline: "none",
    resize: "vertical",
    minHeight: "110px",
  },

  formFooter: {
    marginTop: "30px",
    paddingTop: "22px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  footerInfo: {
    color: "#6b7280",
    fontSize: "12px",
  },

  saveButton: {
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

  spinner: {
    fontSize: "35px",
    marginBottom: "10px",
  },
};

export default PatientHistory;