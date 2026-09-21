import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function DoctorDashboard() {
  const [dashboard, setDashboard] = useState({
    patients: 0,
    medicalHistories: 0,
    medicalDocuments: 0,
    pendingReviews: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/doctor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load doctor dashboard"
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
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>🩺</div>

          <h2 style={styles.loadingTitle}>
            Loading Doctor Dashboard
          </h2>

          <p style={styles.loadingText}>
            Please wait while we load your dashboard...
          </p>

          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <section style={styles.header}>
          <div>
            <p style={styles.headerLabel}>
              DOCTOR PORTAL
            </p>

            <h1 style={styles.title}>
              Doctor Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome to the MediHistory Doctor Portal.
              Manage patients, medical records, documents,
              and AI-generated summaries.
            </p>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.doctorIcon}>
              🩺
            </div>

            <button
              onClick={fetchDashboard}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>
              ⚠️
            </span>

            <div>
              <strong>Unable to load dashboard</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Overview */}
        <section>
          <div style={styles.sectionHeading}>
            <div>
              <h2 style={styles.sectionTitle}>
                Dashboard Overview
              </h2>

              <p style={styles.sectionSubtitle}>
                Quick overview of your current clinical workload.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              📊
            </div>
          </div>

          <div style={styles.cardGrid}>

            {/* Patients */}
            <div
              style={{
                ...styles.statCard,
                borderTop: "4px solid #0f766e",
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  background: "#ecfdf5",
                }}
              >
                👥
              </div>

              <div>
                <p style={styles.cardLabel}>
                  PATIENTS
                </p>

                <h2 style={styles.cardNumber}>
                  {dashboard.patients}
                </h2>

                <p style={styles.cardDescription}>
                  Registered patients
                </p>
              </div>
            </div>

            {/* Histories */}
            <div
              style={{
                ...styles.statCard,
                borderTop: "4px solid #0e7490",
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  background: "#ecfeff",
                }}
              >
                📋
              </div>

              <div>
                <p style={styles.cardLabel}>
                  MEDICAL HISTORIES
                </p>

                <h2 style={styles.cardNumber}>
                  {dashboard.medicalHistories}
                </h2>

                <p style={styles.cardDescription}>
                  Patient histories
                </p>
              </div>
            </div>

            {/* Documents */}
            <div
              style={{
                ...styles.statCard,
                borderTop: "4px solid #2563eb",
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  background: "#eff6ff",
                }}
              >
                📄
              </div>

              <div>
                <p style={styles.cardLabel}>
                  MEDICAL DOCUMENTS
                </p>

                <h2 style={styles.cardNumber}>
                  {dashboard.medicalDocuments}
                </h2>

                <p style={styles.cardDescription}>
                  Uploaded documents
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div
              style={{
                ...styles.statCard,
                borderTop:
                  dashboard.pendingReviews > 0
                    ? "4px solid #ea580c"
                    : "4px solid #16a34a",
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  background:
                    dashboard.pendingReviews > 0
                      ? "#fff7ed"
                      : "#f0fdf4",
                }}
              >
                {dashboard.pendingReviews > 0
                  ? "⏳"
                  : "✓"}
              </div>

              <div>
                <p style={styles.cardLabel}>
                  PENDING REVIEWS
                </p>

                <h2 style={styles.cardNumber}>
                  {dashboard.pendingReviews}
                </h2>

                <p style={styles.cardDescription}>
                  AI summaries awaiting review
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.actionSection}>

          <div style={styles.sectionHeading}>
            <div>
              <h2 style={styles.sectionTitle}>
                Quick Actions
              </h2>

              <p style={styles.sectionSubtitle}>
                Quickly access the most important doctor tools.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              ⚡
            </div>
          </div>

          <div style={styles.actionGrid}>

            <Link
              to="/doctor/patients"
              style={styles.link}
            >
              <div style={styles.actionCard}>
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#ecfdf5",
                  }}
                >
                  👥
                </div>

                <h3 style={styles.actionTitle}>
                  View Patients
                </h3>

                <p style={styles.actionDescription}>
                  View registered patients and access
                  their medical information.
                </p>

                <span style={styles.actionLink}>
                  View Patients →
                </span>
              </div>
            </Link>

            <Link
              to="/doctor/patients"
              style={styles.link}
            >
              <div style={styles.actionCard}>
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#eff6ff",
                  }}
                >
                  📋
                </div>

                <h3 style={styles.actionTitle}>
                  Medical History
                </h3>

                <p style={styles.actionDescription}>
                  Review patient medical history and
                  doctor-reviewed information.
                </p>

                <span style={styles.actionLink}>
                  View History →
                </span>
              </div>
            </Link>

            <Link
              to="/doctor/patients"
              style={styles.link}
            >
              <div style={styles.actionCard}>
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#f5f3ff",
                  }}
                >
                  📄
                </div>

                <h3 style={styles.actionTitle}>
                  Medical Documents
                </h3>

                <p style={styles.actionDescription}>
                  View uploaded documents, OCR text,
                  and processing status.
                </p>

                <span style={styles.actionLink}>
                  View Documents →
                </span>
              </div>
            </Link>

            <Link
              to="/doctor/patients"
              style={styles.link}
            >
              <div style={styles.actionCard}>
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#fff7ed",
                  }}
                >
                  🤖
                </div>

                <h3 style={styles.actionTitle}>
                  AI Summaries
                </h3>

                <p style={styles.actionDescription}>
                  Review AI-generated summaries and
                  confirm them.
                </p>

                <span style={styles.actionLink}>
                  Review Summaries →
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* Review Status */}
        <section style={styles.reviewSection}>

          <div style={styles.sectionHeading}>
            <div>
              <h2 style={styles.sectionTitle}>
                Review Status
              </h2>

              <p style={styles.sectionSubtitle}>
                Monitor AI-generated medical document summaries.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              🔎
            </div>
          </div>

          {dashboard.pendingReviews > 0 ? (
            <div style={styles.pendingReviewBox}>

              <div style={styles.reviewStatusIcon}>
                ⏳
              </div>

              <div style={styles.reviewContent}>
                <h3 style={styles.pendingTitle}>
                  {dashboard.pendingReviews} review
                  {dashboard.pendingReviews > 1
                    ? "s"
                    : ""}{" "}
                  pending
                </h3>

                <p style={styles.reviewText}>
                  Some medical documents contain AI-generated
                  summaries that require doctor verification.
                </p>

                <Link to="/doctor/patients">
                  <button style={styles.primaryButton}>
                    Review Now →
                  </button>
                </Link>
              </div>

            </div>
          ) : (
            <div style={styles.completedReviewBox}>

              <div style={styles.completedIcon}>
                ✓
              </div>

              <div>
                <h3 style={styles.completedTitle}>
                  All Reviews Completed
                </h3>

                <p style={styles.reviewText}>
                  There are currently no pending AI summary
                  reviews.
                </p>
              </div>

            </div>
          )}

        </section>

        {/* Security Information */}
        <section style={styles.securityCard}>

          <div style={styles.securityIcon}>
            🔐
          </div>

          <div>
            <h3 style={styles.securityTitle}>
              Secure Clinical Information
            </h3>

            <p style={styles.securityText}>
              Patient medical information and AI-generated
              summaries should be reviewed carefully and
              handled securely. AI summaries are intended
              to assist clinical review and should be verified
              by a qualified healthcare professional.
            </p>
          </div>

        </section>

        <p style={styles.footer}>
          MediHistory • Digital Patient Medical History System
        </p>

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
    maxWidth: "1150px",
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
    gap: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 10px 30px rgba(15, 118, 110, 0.18)",
  },

  headerLabel: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    opacity: 0.85,
  },

  title: {
    margin: "0 0 8px",
    fontSize: "32px",
    fontWeight: "800",
  },

  subtitle: {
    margin: 0,
    maxWidth: "680px",
    fontSize: "14px",
    lineHeight: "1.6",
    opacity: 0.9,
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },

  doctorIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  refreshButton: {
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    borderRadius: "9px",
    padding: "9px 15px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "14px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "25px",
  },

  errorIcon: {
    fontSize: "18px",
  },

  errorBoxStrong: {
    fontSize: "14px",
  },

  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "18px",
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
    lineHeight: "1.5",
  },

  sectionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "32px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
  },

  cardIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  cardLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.9px",
  },

  cardNumber: {
    margin: "3px 0",
    color: "#111827",
    fontSize: "28px",
    lineHeight: "1.1",
  },

  cardDescription: {
    margin: 0,
    color: "#6b7280",
    fontSize: "11px",
  },

  actionSection: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "28px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  link: {
    textDecoration: "none",
    color: "inherit",
  },

  actionCard: {
    height: "100%",
    minHeight: "205px",
    boxSizing: "border-box",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "21px",
    background: "#ffffff",
    transition: "transform 0.2s ease",
  },

  actionIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    marginBottom: "16px",
  },

  actionTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "16px",
  },

  actionDescription: {
    margin: "0 0 18px",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  actionLink: {
    color: "#0f766e",
    fontSize: "12px",
    fontWeight: "800",
  },

  reviewSection: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  pendingReviewBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },

  reviewStatusIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  reviewContent: {
    flex: 1,
  },

  pendingTitle: {
    margin: "0 0 5px",
    color: "#9a3412",
    fontSize: "17px",
  },

  reviewText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  primaryButton: {
    marginTop: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "11px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 14px rgba(15,118,110,0.18)",
  },

  completedReviewBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  completedIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "800",
    flexShrink: 0,
  },

  completedTitle: {
    margin: "0 0 5px",
    color: "#065f46",
    fontSize: "17px",
  },

  securityCard: {
    background:
      "linear-gradient(135deg, #ecfdf5, #eff6ff)",
    border: "1px solid #bfdbfe",
    borderRadius: "17px",
    padding: "22px 25px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },

  securityIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  securityTitle: {
    margin: "0 0 5px",
    color: "#115e59",
    fontSize: "16px",
  },

  securityText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    margin: "25px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  loadingPage: {
    minHeight: "calc(100vh - 70px)",
    background: "#f5f8fc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  loadingCard: {
    background: "white",
    borderRadius: "18px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  loadingIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  loadingTitle: {
    margin: "0 0 7px",
    color: "#111827",
    fontSize: "20px",
  },

  loadingText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  spinner: {
    width: "22px",
    height: "22px",
    margin: "18px auto 0",
    border: "3px solid #d1fae5",
    borderTop: "3px solid #0f766e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default DoctorDashboard;
