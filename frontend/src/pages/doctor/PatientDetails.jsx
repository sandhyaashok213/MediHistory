import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [success, setSuccess] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchPatient = async () => {
    try {
      setError("");

      const token = getToken();

      const response = await axios.get(
        "http://localhost:5000/api/doctor/patients/" + id,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setPatient(response.data.patient);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message || "Unable to load patient"
        );
      } else {
        setError("Unable to connect to server");
      }
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = getToken();

      const response = await axios.get(
        "http://localhost:5000/api/doctor/patients/" +
          id +
          "/documents",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load medical documents"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchDocuments();
  }, [id]);

  const confirmSummary = async (documentId) => {
    try {
      setConfirmingId(documentId);
      setError("");
      setSuccess("");

      const token = getToken();

      const response = await axios.put(
        "http://localhost:5000/api/doctor/patients/" +
          id +
          "/documents/" +
          documentId +
          "/confirm",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setSuccess(
        response.data.message ||
          "AI summary confirmed successfully."
      );

      setDocuments((previousDocuments) =>
        previousDocuments.map((document) =>
          document.id === documentId
            ? {
                ...document,
                doctor_reviewed: 1,
                doctor_reviewed_at: new Date().toISOString(),
              }
            : document
        )
      );
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to confirm AI summary"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setConfirmingId(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return styles.completedBadge;
    }

    if (status === "processing") {
      return styles.processingBadge;
    }

    if (status === "failed") {
      return styles.failedBadge;
    }

    return styles.defaultBadge;
  };

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return "✓";
    }

    if (status === "processing") {
      return "⏳";
    }

    if (status === "failed") {
      return "✕";
    }

    return "?";
  };

  const getStatusText = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>👨‍⚕️</div>

          <h2 style={styles.loadingTitle}>
            Loading Patient Details
          </h2>

          <p style={styles.loadingText}>
            Please wait while we retrieve the patient's information.
          </p>

          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorPage}>
            <div style={styles.errorPageIcon}>⚠️</div>

            <h2 style={styles.errorPageTitle}>
              Unable to Load Patient
            </h2>

            <p style={styles.errorPageText}>{error}</p>

            <Link to="/doctor/patients">
              <button style={styles.backButton}>
                ← Back to Patients
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyPage}>
            <div style={styles.emptyPageIcon}>👤</div>

            <h2 style={styles.emptyPageTitle}>
              Patient Not Found
            </h2>

            <p style={styles.emptyPageText}>
              The requested patient record could not be found.
            </p>

            <Link to="/doctor/patients">
              <button style={styles.backButton}>
                ← Back to Patients
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const reviewedCount = documents.filter(
    (document) => document.doctor_reviewed === 1
  ).length;

  const pendingCount = documents.filter(
    (document) => document.doctor_reviewed !== 1
  ).length;

  const summaryCount = documents.filter(
    (document) => document.ai_summary
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroMain}>
            <div style={styles.avatar}>
              {patient.name
                ? patient.name.charAt(0).toUpperCase()
                : "P"}
            </div>

            <div style={styles.heroInfo}>
              <p style={styles.heroLabel}>DOCTOR PORTAL</p>

              <h1 style={styles.heroTitle}>
                {patient.name || "Patient"}
              </h1>

              <p style={styles.heroSubtitle}>
                Patient medical record and AI document review
              </p>

              <div style={styles.heroMeta}>
                <span style={styles.metaPill}>
                  ID: {id}
                </span>

                <span style={styles.metaPill}>
                  {patient.gender || "Gender not provided"}
                </span>

                <span style={styles.metaPill}>
                  Blood Group:{" "}
                  {patient.blood_group || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.heroActions}>
            <Link to="/doctor/patients">
              <button style={styles.heroSecondaryButton}>
                ← Patients
              </button>
            </Link>

            <button
              onClick={() => {
                fetchPatient();
                fetchDocuments();
              }}
              style={styles.heroRefreshButton}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        {error && (
          <div style={styles.alertError}>
            <span style={styles.alertIcon}>⚠️</span>

            <div>
              <strong style={styles.alertTitle}>
                Something went wrong
              </strong>

              <p style={styles.alertText}>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={styles.alertSuccess}>
            <span style={styles.alertIcon}>✓</span>

            <div>
              <strong style={styles.alertSuccessTitle}>
                Review Updated
              </strong>

              <p style={styles.alertSuccessText}>{success}</p>
            </div>
          </div>
        )}

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#eff6ff",
                color: "#2563eb",
              }}
            >
              📄
            </div>

            <div>
              <p style={styles.statLabel}>DOCUMENTS</p>
              <h3 style={styles.statValue}>{documents.length}</h3>
              <p style={styles.statDescription}>
                Uploaded records
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#f5f3ff",
                color: "#7c3aed",
              }}
            >
              🤖
            </div>

            <div>
              <p style={styles.statLabel}>AI SUMMARIES</p>
              <h3 style={styles.statValue}>{summaryCount}</h3>
              <p style={styles.statDescription}>
                Available summaries
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#ecfdf5",
                color: "#059669",
              }}
            >
              ✓
            </div>

            <div>
              <p style={styles.statLabel}>REVIEWED</p>
              <h3 style={styles.statValue}>{reviewedCount}</h3>
              <p style={styles.statDescription}>
                Doctor confirmed
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fff7ed",
                color: "#ea580c",
              }}
            >
              ⏳
            </div>

            <div>
              <p style={styles.statLabel}>PENDING</p>
              <h3 style={styles.statValue}>{pendingCount}</h3>
              <p style={styles.statDescription}>
                Need review
              </p>
            </div>
          </div>
        </section>

        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.cardLabel}>PATIENT PROFILE</p>

                  <h2 style={styles.cardTitle}>
                    Personal Information
                  </h2>
                </div>

                <div style={styles.cardHeaderIcon}>👤</div>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Full Name</span>
                  <span style={styles.infoValue}>
                    {patient.name || "Not provided"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email</span>
                  <span style={styles.infoValue}>
                    {patient.email || "Not provided"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone</span>
                  <span style={styles.infoValue}>
                    {patient.phone || "Not provided"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Date of Birth</span>
                  <span style={styles.infoValue}>
                    {patient.date_of_birth || "Not provided"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Gender</span>
                  <span style={styles.infoValue}>
                    {patient.gender || "Not provided"}
                  </span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Blood Group</span>
                  <span style={styles.infoValue}>
                    {patient.blood_group || "Not provided"}
                  </span>
                </div>
              </div>

              <div style={styles.fullWidthInfo}>
                <span style={styles.infoLabel}>Address</span>

                <span style={styles.infoValue}>
                  {patient.address || "Not provided"}
                </span>
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.cardLabel}>EMERGENCY CONTACT</p>

                  <h2 style={styles.cardTitle}>
                    Emergency Information
                  </h2>
                </div>

                <div
                  style={{
                    ...styles.cardHeaderIcon,
                    background: "#fff7ed",
                  }}
                >
                  🚨
                </div>
              </div>

              <div style={styles.emergencyGrid}>
                <div style={styles.emergencyItem}>
                  <div style={styles.emergencyIcon}>👤</div>

                  <div>
                    <span style={styles.infoLabel}>Contact Name</span>

                    <strong style={styles.emergencyValue}>
                      {patient.emergency_contact_name ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                <div style={styles.emergencyItem}>
                  <div style={styles.emergencyIcon}>📞</div>

                  <div>
                    <span style={styles.infoLabel}>Contact Phone</span>

                    <strong style={styles.emergencyValue}>
                      {patient.emergency_contact_phone ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.cardLabel}>AI DOCUMENT REVIEW</p>

                  <h2 style={styles.cardTitle}>
                    AI-Generated Summaries
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Review and confirm summaries generated from patient
                    medical documents.
                  </p>
                </div>

                <div
                  style={{
                    ...styles.cardHeaderIcon,
                    background: "#f5f3ff",
                  }}
                >
                  🤖
                </div>
              </div>

              {documents.length === 0 ? (
                <div style={styles.noDocuments}>
                  <div style={styles.noDocumentsIcon}>📂</div>

                  <h3 style={styles.noDocumentsTitle}>
                    No Medical Documents
                  </h3>

                  <p style={styles.noDocumentsText}>
                    This patient has not uploaded any medical documents
                    yet.
                  </p>
                </div>
              ) : (
                <div style={styles.documentList}>
                  {documents.map((document) => (
                    <article
                      key={document.id}
                      style={styles.documentCard}
                    >
                      <div style={styles.documentTop}>
                        <div style={styles.documentTitleArea}>
                          <div style={styles.documentIcon}>📄</div>

                          <div>
                            <h3 style={styles.documentName}>
                              {document.file_name ||
                                "Medical Document"}
                            </h3>

                            <div style={styles.documentMeta}>
                              <span>
                                {document.document_type ||
                                  "Document"}
                              </span>

                              <span>•</span>

                              <span>
                                {document.created_at
                                  ? new Date(
                                      document.created_at
                                    ).toLocaleDateString()
                                  : "Date unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          style={getStatusStyle(
                            document.processing_status
                          )}
                        >
                          <span>
                            {getStatusIcon(
                              document.processing_status
                            )}
                          </span>

                          {getStatusText(
                            document.processing_status
                          )}
                        </span>
                      </div>

                      <div style={styles.documentDivider}></div>

                      <div style={styles.summaryArea}>
                        <div style={styles.summaryHeading}>
                          <span style={styles.summaryHeadingIcon}>
                            ✨
                          </span>

                          <div>
                            <h4 style={styles.summaryTitle}>
                              AI Summary
                            </h4>

                            <p style={styles.summarySubtitle}>
                              Generated from extracted document text
                            </p>
                          </div>
                        </div>

                        {document.ai_summary ? (
                          <div style={styles.aiSummaryBox}>
                            <p style={styles.aiSummaryText}>
                              {document.ai_summary}
                            </p>

                            <div style={styles.aiWarning}>
                              <span>ℹ️</span>

                              <p style={styles.aiWarningText}>
                                Verify the AI-generated information
                                before using it for clinical decisions.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div style={styles.noSummaryBox}>
                            <span>ℹ️</span>

                            <p style={styles.noSummaryText}>
                              AI summary is not available for this
                              document.
                            </p>
                          </div>
                        )}
                      </div>

                      <div style={styles.reviewArea}>
                        <div style={styles.reviewTop}>
                          <div style={styles.reviewTitleArea}>
                            <div style={styles.reviewIcon}>
                              👨‍⚕️
                            </div>

                            <div>
                              <h4 style={styles.reviewTitle}>
                                Doctor Review
                              </h4>

                              <p style={styles.reviewSubtitle}>
                                Confirmation status
                              </p>
                            </div>
                          </div>

                          {document.doctor_reviewed === 1 ? (
                            <span style={styles.reviewedBadge}>
                              ✓ Reviewed
                            </span>
                          ) : (
                            <span style={styles.pendingBadge}>
                              ⏳ Pending
                            </span>
                          )}
                        </div>

                        {document.doctor_reviewed === 1 ? (
                          <div style={styles.confirmedBox}>
                            <div style={styles.confirmedIcon}>
                              ✓
                            </div>

                            <div>
                              <h4 style={styles.confirmedTitle}>
                                Summary Reviewed and Confirmed
                              </h4>

                              <p style={styles.confirmedText}>
                                The AI-generated summary has been
                                reviewed and confirmed by the doctor.
                              </p>

                              <p style={styles.confirmedDate}>
                                Confirmed at:{" "}
                                {document.doctor_reviewed_at
                                  ? new Date(
                                      document.doctor_reviewed_at
                                    ).toLocaleString()
                                  : "Not available"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div style={styles.pendingBox}>
                            <div style={styles.pendingIcon}>
                              ⏳
                            </div>

                            <div style={styles.pendingContent}>
                              <h4 style={styles.pendingTitle}>
                                Review Required
                              </h4>

                              <p style={styles.pendingText}>
                                This AI summary has not yet been
                                confirmed by a doctor.
                              </p>

                              {document.ai_summary ? (
                                <button
                                  onClick={() =>
                                    confirmSummary(document.id)
                                  }
                                  disabled={
                                    confirmingId === document.id
                                  }
                                  style={
                                    confirmingId === document.id
                                      ? styles.confirmButtonDisabled
                                      : styles.confirmButton
                                  }
                                >
                                  {confirmingId === document.id
                                    ? "Confirming..."
                                    : "✓ Confirm AI Summary"}
                                </button>
                              ) : (
                                <p style={styles.noSummaryText}>
                                  There is no AI summary available to
                                  confirm.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside style={styles.rightColumn}>
            <section style={styles.quickCard}>
              <div style={styles.quickHeader}>
                <div>
                  <p style={styles.cardLabel}>QUICK ACCESS</p>

                  <h2 style={styles.quickTitle}>
                    Medical Records
                  </h2>
                </div>

                <div style={styles.quickIcon}>⚡</div>
              </div>

              <div style={styles.quickLinks}>
                <Link
                  to={"/doctor/patients/" + id + "/history"}
                  style={styles.quickLink}
                >
                  <div style={styles.quickLinkIcon}>📋</div>

                  <div style={styles.quickLinkText}>
                    <strong>Medical History</strong>
                    <span>View patient's history</span>
                  </div>

                  <span style={styles.arrow}>→</span>
                </Link>

                <Link
                  to={"/doctor/patients/" + id + "/medications"}
                  style={styles.quickLink}
                >
                  <div style={styles.quickLinkIcon}>💊</div>

                  <div style={styles.quickLinkText}>
                    <strong>Medications</strong>
                    <span>View medication records</span>
                  </div>

                  <span style={styles.arrow}>→</span>
                </Link>

                <Link
                  to={"/doctor/patients/" + id + "/documents"}
                  style={styles.quickLink}
                >
                  <div style={styles.quickLinkIcon}>📄</div>

                  <div style={styles.quickLinkText}>
                    <strong>Medical Documents</strong>
                    <span>View uploaded documents</span>
                  </div>

                  <span style={styles.arrow}>→</span>
                </Link>
              </div>
            </section>

            <section style={styles.reviewProgressCard}>
              <div style={styles.progressHeader}>
                <div>
                  <p style={styles.cardLabel}>REVIEW PROGRESS</p>

                  <h2 style={styles.quickTitle}>
                    Document Review
                  </h2>
                </div>

                <span style={styles.progressNumber}>
                  {documents.length > 0
                    ? Math.round(
                        (reviewedCount / documents.length) * 100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width:
                      documents.length > 0
                        ? Math.round(
                            (reviewedCount / documents.length) * 100
                          ) + "%"
                        : "0%",
                  }}
                ></div>
              </div>

              <div style={styles.progressMeta}>
                <span>
                  {reviewedCount} reviewed
                </span>

                <span>
                  {pendingCount} pending
                </span>
              </div>
            </section>

            <section style={styles.securityCard}>
              <div style={styles.securityIcon}>🔐</div>

              <h3 style={styles.securityTitle}>
                Clinical Information
              </h3>

              <p style={styles.securityText}>
                Patient records, medical documents, and AI summaries
                contain sensitive healthcare information. Handle all
                information securely and review AI-generated content
                before clinical use.
              </p>
            </section>
          </aside>
        </div>

        <section style={styles.bottomNavigation}>
          <Link to="/doctor/patients">
            <button style={styles.backButton}>
              ← Back to Patients
            </button>
          </Link>

          <div style={styles.bottomActions}>
            <Link to={"/doctor/patients/" + id + "/history"}>
              <button style={styles.secondaryButton}>
                📋 Medical History
              </button>
            </Link>

            <Link to={"/doctor/patients/" + id + "/medications"}>
              <button style={styles.secondaryButton}>
                💊 Medications
              </button>
            </Link>

            <Link to={"/doctor/patients/" + id + "/documents"}>
              <button style={styles.secondaryButton}>
                📄 Documents
              </button>
            </Link>
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
    background: "#f4f7fb",
    padding: "36px 5%",
    color: "#1f2937",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  hero: {
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    borderRadius: "24px",
    padding: "30px 34px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "24px",
    boxShadow: "0 14px 35px rgba(14, 116, 144, 0.16)",
  },

  heroMain: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minWidth: 0,
  },

  avatar: {
    width: "78px",
    height: "78px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    flexShrink: 0,
  },

  heroInfo: {
    minWidth: 0,
  },

  heroLabel: {
    margin: "0 0 6px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    opacity: 0.8,
  },

  heroTitle: {
    margin: "0 0 7px",
    fontSize: "30px",
    fontWeight: "800",
    wordBreak: "break-word",
  },

  heroSubtitle: {
    margin: "0 0 12px",
    fontSize: "13px",
    opacity: 0.88,
    lineHeight: "1.5",
  },

  heroMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  metaPill: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    fontSize: "10px",
    fontWeight: "700",
  },

  heroActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexShrink: 0,
  },

  heroSecondaryButton: {
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  heroRefreshButton: {
    border: "none",
    background: "white",
    color: "#0f766e",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  alertError: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "14px 17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    marginBottom: "20px",
  },

  alertSuccess: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    padding: "14px 17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    marginBottom: "20px",
  },

  alertIcon: {
    fontSize: "18px",
    lineHeight: 1,
    marginTop: "2px",
  },

  alertTitle: {
    color: "#991b1b",
    fontSize: "13px",
  },

  alertText: {
    margin: "4px 0 0",
    color: "#b91c1c",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  alertSuccessTitle: {
    color: "#065f46",
    fontSize: "13px",
  },

  alertSuccessText: {
    margin: "4px 0 0",
    color: "#047857",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  statLabel: {
    margin: "0 0 3px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  statValue: {
    margin: "0",
    color: "#111827",
    fontSize: "22px",
    lineHeight: 1,
  },

  statDescription: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "10px",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 320px",
    gap: "22px",
    alignItems: "start",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "19px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },

  cardLabel: {
    margin: "0 0 5px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  cardTitle: {
    margin: "0",
    color: "#111827",
    fontSize: "20px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.55",
  },

  cardHeaderIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  infoItem: {
    background: "#f8fafc",
    border: "1px solid #edf2f7",
    borderRadius: "12px",
    padding: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: 0,
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },

  infoValue: {
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: "700",
    wordBreak: "break-word",
  },

  fullWidthInfo: {
    marginTop: "12px",
    background: "#f8fafc",
    border: "1px solid #edf2f7",
    borderRadius: "12px",
    padding: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  emergencyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  emergencyItem: {
    background: "#fffaf5",
    border: "1px solid #ffedd5",
    borderRadius: "13px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  emergencyIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  emergencyValue: {
    display: "block",
    marginTop: "4px",
    color: "#9a3412",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  documentList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  documentCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#ffffff",
  },

  documentTop: {
    padding: "17px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  documentTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  documentIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  documentName: {
    margin: "0 0 5px",
    color: "#111827",
    fontSize: "14px",
    fontWeight: "800",
    wordBreak: "break-word",
  },

  documentMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  completedBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  processingBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#fffbeb",
    color: "#a16207",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  failedBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  defaultBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "10px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  documentDivider: {
    height: "1px",
    background: "#eef2f7",
  },

  summaryArea: {
    padding: "18px",
  },

  summaryHeading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  summaryHeadingIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#f5f3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  summaryTitle: {
    margin: "0 0 2px",
    color: "#111827",
    fontSize: "13px",
    fontWeight: "800",
  },

  summarySubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
  },

  aiSummaryBox: {
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fcfbff",
  },

  aiSummaryText: {
    margin: 0,
    padding: "15px",
    color: "#374151",
    fontSize: "12px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },

  aiWarning: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "10px 13px",
    background: "#fafafa",
    borderTop: "1px solid #e5e7eb",
  },

  aiWarningText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "10px",
    lineHeight: "1.5",
  },

  noSummaryBox: {
    padding: "13px",
    borderRadius: "11px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  noSummaryText: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  reviewArea: {
    padding: "17px 18px 18px",
    background: "#fbfdff",
    borderTop: "1px solid #eef2f7",
  },

  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  reviewTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  reviewIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  reviewTitle: {
    margin: "0 0 2px",
    color: "#111827",
    fontSize: "13px",
    fontWeight: "800",
  },

  reviewSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "10px",
  },

  reviewedBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  pendingBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#fff7ed",
    color: "#c2410c",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  confirmedBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  confirmedIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "800",
    flexShrink: 0,
  },

  confirmedTitle: {
    margin: "0 0 4px",
    color: "#065f46",
    fontSize: "12px",
  },

  confirmedText: {
    margin: "0 0 5px",
    color: "#047857",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  confirmedDate: {
    margin: 0,
    color: "#6b7280",
    fontSize: "10px",
  },

  pendingBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  pendingIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  pendingContent: {
    flex: 1,
  },

  pendingTitle: {
    margin: "0 0 4px",
    color: "#9a3412",
    fontSize: "12px",
  },

  pendingText: {
    margin: "0 0 10px",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  confirmButton: {
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "9px 13px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },

  confirmButtonDisabled: {
    border: "none",
    borderRadius: "9px",
    background: "#94a3b8",
    color: "white",
    padding: "9px 13px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "not-allowed",
  },

  noDocuments: {
    padding: "45px 20px",
    textAlign: "center",
    borderRadius: "15px",
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
  },

  noDocumentsIcon: {
    width: "62px",
    height: "62px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    background: "#eef2f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
  },

  noDocumentsTitle: {
    margin: "0 0 6px",
    color: "#111827",
    fontSize: "17px",
  },

  noDocumentsText: {
    margin: "0 auto",
    maxWidth: "430px",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  quickCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "21px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  quickHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "15px",
  },

  quickTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "18px",
  },

  quickIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  quickLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  quickLink: {
    textDecoration: "none",
    background: "#f8fafc",
    border: "1px solid #edf2f7",
    borderRadius: "12px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#1f2937",
  },

  quickLinkIcon: {
    width: "37px",
    height: "37px",
    borderRadius: "10px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  quickLinkText: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    flex: 1,
  },

  quickLinkTextStrong: {
    color: "#111827",
    fontSize: "12px",
  },

  arrow: {
    color: "#94a3b8",
    fontSize: "16px",
  },

  reviewProgressCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "21px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  progressNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#ecfdf5",
    color: "#047857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "800",
  },

  progressTrack: {
    height: "9px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0f766e, #0e7490)",
    borderRadius: "20px",
    transition: "width 0.3s ease",
  },

  progressMeta: {
    marginTop: "9px",
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "10px",
  },

  securityCard: {
    background: "linear-gradient(135deg, #ecfdf5, #eff6ff)",
    border: "1px solid #bfdbfe",
    borderRadius: "18px",
    padding: "20px",
  },

  securityIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    marginBottom: "12px",
  },

  securityTitle: {
    margin: "0 0 6px",
    color: "#115e59",
    fontSize: "15px",
  },

  securityText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "11px",
    lineHeight: "1.65",
  },

  bottomNavigation: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  bottomActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  backButton: {
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "11px 17px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "white",
    color: "#374151",
    padding: "10px 14px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    margin: "24px 0 5px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  errorPage: {
    maxWidth: "500px",
    margin: "80px auto",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  errorPageIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
  },

  errorPageTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "21px",
  },

  errorPageText: {
    margin: "0 auto 20px",
    maxWidth: "380px",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  emptyPage: {
    maxWidth: "500px",
    margin: "80px auto",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  emptyPageIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
  },

  emptyPageTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "21px",
  },

  emptyPageText: {
    margin: "0 auto 20px",
    maxWidth: "380px",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  loadingPage: {
    minHeight: "calc(100vh - 70px)",
    background: "#f4f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  loadingCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  loadingIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 17px",
    borderRadius: "50%",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  loadingTitle: {
    margin: "0 0 7px",
    color: "#111827",
    fontSize: "20px",
  },

  loadingText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "12px",
  },

  spinner: {
    width: "23px",
    height: "23px",
    margin: "18px auto 0",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #0e7490",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default PatientDetails;
