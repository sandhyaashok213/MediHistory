import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function MedicalDocuments() {
  const { id } = useParams();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

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
    fetchDocuments();
  }, [id]);

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
          <div style={styles.loadingIcon}>📄</div>

          <h2 style={styles.loadingTitle}>
            Loading Medical Documents
          </h2>

          <p style={styles.loadingText}>
            Please wait while we retrieve the patient's documents.
          </p>

          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.header}>
          <div>
            <p style={styles.headerLabel}>DOCTOR PORTAL</p>

            <h1 style={styles.title}>Medical Documents</h1>

            <p style={styles.subtitle}>
              Review patient documents, OCR results, AI-generated
              summaries, and doctor review status.
            </p>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.headerIcon}>📄</div>

            <button
              onClick={fetchDocuments}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>

            <div>
              <strong style={styles.errorTitle}>
                Unable to load documents
              </strong>

              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        <section style={styles.summaryBar}>
          <div style={styles.summaryLeft}>
            <div style={styles.summaryIcon}>📁</div>

            <div>
              <p style={styles.summaryLabel}>
                DOCUMENT LIBRARY
              </p>

              <h2 style={styles.summaryTitle}>
                {documents.length}{" "}
                {documents.length === 1
                  ? "Document"
                  : "Documents"}
              </h2>

              <p style={styles.summaryText}>
                Patient medical records available for review
              </p>
            </div>
          </div>

          <Link to={"/doctor/patients/" + id}>
            <button style={styles.secondaryButton}>
              ← Patient Details
            </button>
          </Link>
        </section>

        {documents.length === 0 && !error && (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>📂</div>

            <h2 style={styles.emptyTitle}>
              No Medical Documents
            </h2>

            <p style={styles.emptyText}>
              This patient has not uploaded any medical documents yet.
            </p>

            <Link to={"/doctor/patients/" + id}>
              <button style={styles.emptyButton}>
                ← Back to Patient
              </button>
            </Link>
          </div>
        )}

        {documents.length > 0 && (
          <div style={styles.documentList}>
            {documents.map((document) => (
              <article
                key={document.id}
                style={styles.documentCard}
              >
                <div style={styles.documentHeader}>
                  <div style={styles.fileSection}>
                    <div style={styles.fileIcon}>📄</div>

                    <div style={styles.fileInfo}>
                      <h2 style={styles.fileName}>
                        {document.file_name ||
                          "Medical Document"}
                      </h2>

                      <p style={styles.fileDate}>
                        Uploaded{" "}
                        {document.created_at
                          ? new Date(
                              document.created_at
                            ).toLocaleString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div
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
                  </div>
                </div>

                <div style={styles.divider}></div>

                <section style={styles.contentSection}>
                  <div style={styles.sectionHeading}>
                    <div
                      style={{
                        ...styles.sectionIcon,
                        background: "#eff6ff",
                      }}
                    >
                      🔍
                    </div>

                    <div>
                      <h3 style={styles.sectionTitle}>
                        OCR Extracted Text
                      </h3>

                      <p style={styles.sectionSubtitle}>
                        Text extracted from the uploaded document
                      </p>
                    </div>
                  </div>

                  {document.ocr_text ? (
                    <div style={styles.ocrBox}>
                      <div style={styles.ocrLabel}>
                        EXTRACTED TEXT
                      </div>

                      <div style={styles.textBox}>
                        {document.ocr_text}
                      </div>
                    </div>
                  ) : (
                    <div style={styles.mutedBox}>
                      <span>ℹ️</span>

                      <p style={styles.mutedText}>
                        OCR text is not available for this document.
                      </p>
                    </div>
                  )}
                </section>

                <section style={styles.contentSection}>
                  <div style={styles.sectionHeading}>
                    <div
                      style={{
                        ...styles.sectionIcon,
                        background: "#f5f3ff",
                      }}
                    >
                      🤖
                    </div>

                    <div>
                      <h3 style={styles.sectionTitle}>
                        AI-Generated Summary
                      </h3>

                      <p style={styles.sectionSubtitle}>
                        Summary generated from extracted document text
                      </p>
                    </div>
                  </div>

                  {document.ai_summary ? (
                    <div style={styles.aiBox}>
                      <div style={styles.aiBadge}>
                        AI SUMMARY
                      </div>

                      <div style={styles.summaryTextBox}>
                        {document.ai_summary}
                      </div>

                      <div style={styles.aiNotice}>
                        <span>ℹ️</span>

                        <p style={styles.aiNoticeText}>
                          Review and verify this summary before
                          using it for clinical decisions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.mutedBox}>
                      <span>ℹ️</span>

                      <p style={styles.mutedText}>
                        AI summary is not available yet.
                      </p>
                    </div>
                  )}
                </section>

                <section style={styles.reviewSection}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewHeading}>
                      <div style={styles.reviewIcon}>
                        👨‍⚕️
                      </div>

                      <div>
                        <h3 style={styles.sectionTitle}>
                          Doctor Review
                        </h3>

                        <p style={styles.sectionSubtitle}>
                          Verification status of the AI summary
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
                          AI Summary Reviewed and Confirmed
                        </h4>

                        <p style={styles.confirmedText}>
                          The AI-generated summary has been reviewed
                          by the doctor.
                        </p>

                        <p style={styles.reviewDate}>
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
                    <div style={styles.pendingReviewBox}>
                      <div style={styles.pendingReviewIcon}>
                        ⏳
                      </div>

                      <div style={styles.pendingReviewContent}>
                        <h4 style={styles.pendingTitle}>
                          AI Summary Waiting for Review
                        </h4>

                        <p style={styles.pendingText}>
                          Please review the AI-generated summary
                          before confirming it.
                        </p>

                        <Link
                          to={"/doctor/patients/" + id}
                        >
                          <button style={styles.reviewButton}>
                            Review Summary →
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </section>
              </article>
            ))}
          </div>
        )}

        <section style={styles.navigation}>
          <Link to={"/doctor/patients/" + id}>
            <button style={styles.backButton}>
              ← Patient Details
            </button>
          </Link>

          <div style={styles.navigationRight}>
            <Link
              to={"/doctor/patients/" + id + "/history"}
            >
              <button style={styles.secondaryButton}>
                📋 Medical History
              </button>
            </Link>

            <Link
              to={"/doctor/patients/" + id + "/medications"}
            >
              <button style={styles.secondaryButton}>
                💊 Medications
              </button>
            </Link>
          </div>
        </section>

        <section style={styles.securityCard}>
          <div style={styles.securityIcon}>🔐</div>

          <div>
            <h3 style={styles.securityTitle}>
              Clinical Document Security
            </h3>

            <p style={styles.securityText}>
              Medical documents and AI-generated summaries contain
              sensitive healthcare information. Review and handle
              this information securely.
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
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    borderRadius: "20px",
    padding: "35px 40px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "25px",
    boxShadow: "0 10px 30px rgba(15, 118, 110, 0.18)",
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
    maxWidth: "720px",
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

  headerIcon: {
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
    borderRadius: "14px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "22px",
  },

  errorIcon: {
    fontSize: "18px",
  },

  errorTitle: {
    color: "#991b1b",
    fontSize: "14px",
  },

  errorText: {
    margin: "4px 0 0",
    color: "#b91c1c",
    fontSize: "13px",
  },

  summaryBar: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px 20px",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.03)",
  },

  summaryLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  summaryIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  summaryLabel: {
    margin: "0 0 3px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  summaryTitle: {
    margin: "0 0 3px",
    color: "#111827",
    fontSize: "20px",
  },

  summaryText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "11px",
  },

  documentList: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  documentCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  documentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  fileSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: 0,
  },

  fileIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
  },

  fileInfo: {
    minWidth: 0,
  },

  fileName: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
    wordBreak: "break-word",
  },

  fileDate: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "12px",
  },

  completedBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  processingBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#fffbeb",
    color: "#a16207",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  failedBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  defaultBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },

  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "23px 0",
  },

  contentSection: {
    marginTop: "25px",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: "0 0 3px",
    fontSize: "16px",
    color: "#111827",
  },

  sectionSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },

  ocrBox: {
    border: "1px solid #dbeafe",
    borderRadius: "13px",
    overflow: "hidden",
  },

  ocrLabel: {
    padding: "9px 13px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  textBox: {
    padding: "17px",
    minHeight: "90px",
    maxHeight: "320px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: "1.7",
    color: "#374151",
    fontSize: "13px",
    background: "#ffffff",
  },

  aiBox: {
    border: "1px solid #ddd6fe",
    borderRadius: "13px",
    overflow: "hidden",
  },

  aiBadge: {
    padding: "9px 13px",
    background: "#f5f3ff",
    color: "#6d28d9",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  summaryTextBox: {
    padding: "17px",
    whiteSpace: "pre-wrap",
    lineHeight: "1.7",
    color: "#374151",
    fontSize: "13px",
  },

  aiNotice: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "11px 14px",
    background: "#fafafa",
    borderTop: "1px solid #e5e7eb",
  },

  aiNoticeText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  mutedBox: {
    padding: "14px 16px",
    borderRadius: "11px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
  },

  mutedText: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
  },

  reviewSection: {
    marginTop: "27px",
    paddingTop: "23px",
    borderTop: "1px solid #e5e7eb",
  },

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "16px",
  },

  reviewHeading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  reviewIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  reviewedBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "11px",
    fontWeight: "800",
  },

  pendingBadge: {
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#fff7ed",
    color: "#c2410c",
    fontSize: "11px",
    fontWeight: "800",
  },

  confirmedBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  confirmedIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
    flexShrink: 0,
  },

  confirmedTitle: {
    margin: "0 0 5px",
    color: "#065f46",
    fontSize: "14px",
  },

  confirmedText: {
    margin: "0 0 5px",
    color: "#047857",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  reviewDate: {
    margin: 0,
    color: "#6b7280",
    fontSize: "11px",
  },

  pendingReviewBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "14px",
    padding: "18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  pendingReviewIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  pendingReviewContent: {
    flex: 1,
  },

  pendingTitle: {
    margin: "0 0 5px",
    color: "#9a3412",
    fontSize: "14px",
  },

  pendingText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  reviewButton: {
    marginTop: "12px",
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyBox: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "60px 25px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  emptyIcon: {
    width: "75px",
    height: "75px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "20px",
  },

  emptyText: {
    margin: "0 auto 20px",
    maxWidth: "450px",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  emptyButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "white",
    color: "#374151",
    padding: "10px 17px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  navigationRight: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  backButton: {
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "11px 18px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "white",
    color: "#374151",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  securityCard: {
    marginTop: "28px",
    background: "linear-gradient(135deg, #ecfdf5, #eff6ff)",
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
    fontSize: "12px",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    margin: "25px 0",
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
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  loadingIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#eff6ff",
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
    border: "3px solid #dbeafe",
    borderTop: "3px solid #0e7490",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default MedicalDocuments;
