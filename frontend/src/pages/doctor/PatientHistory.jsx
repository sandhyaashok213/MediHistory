import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PatientHistory() {
  const { id } = useParams();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/doctor/patients/" +
          id +
          "/history",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setHistory(response.data.history || null);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load medical history"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmHistory = async () => {
    try {
      setConfirming(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/doctor/patients/" +
          id +
          "/history/confirm",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setSuccess(
        response.data.message ||
          "Medical history confirmed successfully."
      );

      setHistory((previousHistory) => ({
        ...previousHistory,
        doctor_reviewed: 1,
        doctor_reviewed_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to confirm medical history"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>📋</div>

          <h2 style={styles.loadingTitle}>
            Loading Medical History
          </h2>

          <p style={styles.loadingText}>
            Please wait while we retrieve the patient's record.
          </p>

          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error && !history) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorPage}>
            <div style={styles.errorPageIcon}>⚠️</div>

            <h2 style={styles.errorPageTitle}>
              Unable to Load Medical History
            </h2>

            <p style={styles.errorPageText}>{error}</p>

            <Link to="/doctor/patients">
              <button style={styles.primaryButton}>
                ← Back to Patients
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.header}>
          <div style={styles.headerContent}>
            <p style={styles.headerLabel}>DOCTOR PORTAL</p>

            <h1 style={styles.title}>
              Medical History
            </h1>

            <p style={styles.subtitle}>
              Review the patient's medical history, verify the
              information, and confirm the record.
            </p>

            <div style={styles.patientBadge}>
              <span style={styles.patientBadgeIcon}>👤</span>
              <span>Patient ID: {id}</span>
            </div>
          </div>

          <div style={styles.headerActions}>
            <Link to={"/doctor/patients/" + id}>
              <button style={styles.headerSecondaryButton}>
                ← Patient Details
              </button>
            </Link>

            <button
              onClick={fetchHistory}
              style={styles.headerRefreshButton}
            >
              ↻ Refresh
            </button>
          </div>
        </section>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.messageIcon}>⚠️</span>

            <div>
              <strong style={styles.errorTitle}>
                Something went wrong
              </strong>

              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div style={styles.successBox}>
            <span style={styles.messageIcon}>✓</span>

            <div>
              <strong style={styles.successTitle}>
                Review Updated
              </strong>

              <p style={styles.successText}>{success}</p>
            </div>
          </div>
        )}

        {!error && !history && (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>📂</div>

            <h2 style={styles.emptyTitle}>
              No Medical History
            </h2>

            <p style={styles.emptyText}>
              This patient has not added any medical history yet.
            </p>

            <Link to={"/doctor/patients/" + id}>
              <button style={styles.primaryButton}>
                ← Back to Patient
              </button>
            </Link>
          </div>
        )}

        {history && (
          <>
            <section style={styles.reviewCard}>
              <div style={styles.reviewCardTop}>
                <div style={styles.reviewLeft}>
                  <div
                    style={{
                      ...styles.reviewIcon,
                      background:
                        history.doctor_reviewed === 1
                          ? "#ecfdf5"
                          : "#fff7ed",
                    }}
                  >
                    {history.doctor_reviewed === 1
                      ? "✓"
                      : "👨‍⚕️"}
                  </div>

                  <div>
                    <p style={styles.cardEyebrow}>
                      DOCTOR VERIFICATION
                    </p>

                    <h2 style={styles.reviewTitle}>
                      Medical History Review
                    </h2>
                  </div>
                </div>

                {history.doctor_reviewed === 1 ? (
                  <span style={styles.reviewedBadge}>
                    ✓ Confirmed
                  </span>
                ) : (
                  <span style={styles.pendingBadge}>
                    ⏳ Pending Review
                  </span>
                )}
              </div>

              {history.doctor_reviewed === 1 ? (
                <div style={styles.confirmedBox}>
                  <div style={styles.confirmedIcon}>✓</div>

                  <div>
                    <h3 style={styles.confirmedTitle}>
                      Medical History Reviewed and Confirmed
                    </h3>

                    <p style={styles.confirmedText}>
                      The patient's medical history has been
                      reviewed and confirmed by the doctor.
                    </p>

                    <p style={styles.confirmedDate}>
                      Confirmed at:{" "}
                      {history.doctor_reviewed_at
                        ? new Date(
                            history.doctor_reviewed_at
                          ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.pendingBox}>
                  <div style={styles.pendingIcon}>⏳</div>

                  <div style={styles.pendingContent}>
                    <h3 style={styles.pendingTitle}>
                      Medical History Pending Review
                    </h3>

                    <p style={styles.pendingText}>
                      Review all the information below before
                      confirming this patient's medical history.
                    </p>

                    <button
                      onClick={confirmHistory}
                      disabled={confirming}
                      style={
                        confirming
                          ? styles.confirmButtonDisabled
                          : styles.confirmButton
                      }
                    >
                      {confirming
                        ? "Confirming..."
                        : "✓ Confirm Medical History"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <p style={styles.cardEyebrow}>
                    PATIENT RECORD
                  </p>

                  <h2 style={styles.sectionTitle}>
                    📋 Medical History Details
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Review each section of the patient's recorded
                    medical history.
                  </p>
                </div>

                <div style={styles.sectionIcon}>📋</div>
              </div>

              <div style={styles.historyList}>
                <HistoryItem
                  label="Chief Complaint"
                  value={history.chief_complaint}
                  icon="🩺"
                />

                <HistoryItem
                  label="History of Present Illness"
                  value={history.history_of_present_illness}
                  icon="🔎"
                />

                <HistoryItem
                  label="Past Medical History"
                  value={history.past_medical_history}
                  icon="🏥"
                />

                <HistoryItem
                  label="Past Surgical History"
                  value={history.past_surgical_history}
                  icon="🩹"
                />

                <HistoryItem
                  label="Personal History"
                  value={history.personal_history}
                  icon="👤"
                />

                <HistoryItem
                  label="Family History"
                  value={history.family_history}
                  icon="👨‍👩‍👧‍👦"
                />

                <HistoryItem
                  label="Review of Systems"
                  value={history.review_of_systems}
                  icon="📑"
                />
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <p style={styles.cardEyebrow}>
                    RECORD TIMELINE
                  </p>

                  <h2 style={styles.sectionTitle}>
                    🕒 Record Information
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Important timestamps for this patient's medical
                    history record.
                  </p>
                </div>

                <div style={styles.sectionIcon}>🕒</div>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <div style={styles.infoIcon}>📅</div>

                  <div>
                    <p style={styles.infoLabel}>
                      CREATED AT
                    </p>

                    <p style={styles.infoValue}>
                      {history.created_at
                        ? new Date(
                            history.created_at
                          ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                <div style={styles.infoBox}>
                  <div style={styles.infoIcon}>🔄</div>

                  <div>
                    <p style={styles.infoLabel}>
                      LAST UPDATED
                    </p>

                    <p style={styles.infoValue}>
                      {history.updated_at
                        ? new Date(
                            history.updated_at
                          ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <section style={styles.navigationCard}>
          <div>
            <p style={styles.navigationLabel}>
              CONTINUE REVIEWING
            </p>

            <h3 style={styles.navigationTitle}>
              Explore More Patient Records
            </h3>
          </div>

          <div style={styles.navigationActions}>
            <Link to={"/doctor/patients/" + id}>
              <button style={styles.primaryButton}>
                ← Patient Details
              </button>
            </Link>

            <Link
              to={"/doctor/patients/" + id + "/medications"}
            >
              <button style={styles.secondaryButton}>
                💊 Medications →
              </button>
            </Link>

            <Link
              to={"/doctor/patients/" + id + "/documents"}
            >
              <button style={styles.secondaryButton}>
                📄 Documents →
              </button>
            </Link>
          </div>
        </section>

        <section style={styles.securityCard}>
          <div style={styles.securityIcon}>🔐</div>

          <div>
            <h3 style={styles.securityTitle}>
              Clinical Record Security
            </h3>

            <p style={styles.securityText}>
              Patient medical history contains sensitive healthcare
              information. Review and handle this information
              securely and only for authorized clinical purposes.
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

function HistoryItem({ label, value, icon }) {
  return (
    <div style={styles.historyItem}>
      <div style={styles.historyItemTop}>
        <div style={styles.historyItemIcon}>{icon}</div>

        <div>
          <h3 style={styles.historyLabel}>
            {label}
          </h3>

          <p style={styles.historyHint}>
            Patient-provided medical information
          </p>
        </div>
      </div>

      <div style={styles.historyValue}>
        {value ? (
          value
        ) : (
          <span style={styles.notProvided}>
            Not provided
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    background: "#f4f7fb",
    padding: "38px 5%",
    color: "#1f2937",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  header: {
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    borderRadius: "22px",
    padding: "32px 35px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "22px",
    boxShadow: "0 14px 35px rgba(14, 116, 144, 0.16)",
  },

  headerContent: {
    minWidth: 0,
  },

  headerLabel: {
    margin: "0 0 7px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    opacity: 0.82,
  },

  title: {
    margin: "0 0 8px",
    fontSize: "32px",
    fontWeight: "800",
    lineHeight: "1.2",
  },

  subtitle: {
    margin: "0 0 14px",
    maxWidth: "650px",
    fontSize: "13px",
    lineHeight: "1.6",
    opacity: 0.9,
  },

  patientBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 11px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "10px",
    fontWeight: "700",
  },

  patientBadgeIcon: {
    fontSize: "13px",
  },

  headerActions: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    flexShrink: 0,
  },

  headerSecondaryButton: {
    border: "1px solid rgba(255,255,255,0.28)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    padding: "10px 15px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  headerRefreshButton: {
    border: "none",
    background: "white",
    color: "#0f766e",
    padding: "10px 15px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "14px 17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "18px",
  },

  successBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    padding: "14px 17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "18px",
  },

  messageIcon: {
    fontSize: "17px",
    marginTop: "1px",
  },

  errorTitle: {
    color: "#991b1b",
    fontSize: "13px",
  },

  errorText: {
    margin: "3px 0 0",
    color: "#b91c1c",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  successTitle: {
    color: "#065f46",
    fontSize: "13px",
  },

  successText: {
    margin: "3px 0 0",
    color: "#047857",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  reviewCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "19px",
    padding: "23px",
    marginBottom: "21px",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },

  reviewCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "17px",
  },

  reviewLeft: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  reviewIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  cardEyebrow: {
    margin: "0 0 4px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  reviewTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "19px",
    fontWeight: "800",
  },

  reviewedBadge: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  pendingBadge: {
    padding: "7px 11px",
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
    borderRadius: "14px",
    padding: "17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
  },

  confirmedIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "50%",
    background: "#10b981",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: "800",
    flexShrink: 0,
  },

  confirmedTitle: {
    margin: "0 0 5px",
    color: "#065f46",
    fontSize: "13px",
  },

  confirmedText: {
    margin: "0 0 5px",
    color: "#047857",
    fontSize: "11px",
    lineHeight: "1.55",
  },

  confirmedDate: {
    margin: 0,
    color: "#6b7280",
    fontSize: "10px",
  },

  pendingBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "14px",
    padding: "17px",
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
  },

  pendingIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "50%",
    background: "#ffedd5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },

  pendingContent: {
    flex: 1,
  },

  pendingTitle: {
    margin: "0 0 5px",
    color: "#9a3412",
    fontSize: "13px",
  },

  pendingText: {
    margin: "0 0 11px",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: "1.55",
  },

  confirmButton: {
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "10px 15px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },

  confirmButtonDisabled: {
    border: "none",
    borderRadius: "9px",
    background: "#94a3b8",
    color: "white",
    padding: "10px 15px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "not-allowed",
  },

  section: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "19px",
    padding: "25px",
    marginBottom: "21px",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "20px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: "1.55",
  },

  sectionIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "11px",
  },

  historyItem: {
    padding: "15px",
    border: "1px solid #e8edf3",
    borderRadius: "14px",
    background: "#fbfdff",
  },

  historyItemTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  historyItemIcon: {
    width: "37px",
    height: "37px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  historyLabel: {
    margin: 0,
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: "800",
  },

  historyHint: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "9px",
  },

  historyValue: {
    padding: "13px",
    borderRadius: "10px",
    background: "#f8fafc",
    border: "1px solid #eef2f7",
    color: "#374151",
    lineHeight: "1.7",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    minHeight: "45px",
  },

  notProvided: {
    color: "#94a3b8",
    fontStyle: "italic",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "13px",
  },

  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    borderRadius: "13px",
    background: "#f8fafc",
    border: "1px solid #edf2f7",
  },

  infoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  infoLabel: {
    margin: "0 0 5px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.9px",
  },

  infoValue: {
    margin: 0,
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  navigationCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow: "0 5px 18px rgba(15,23,42,0.03)",
  },

  navigationLabel: {
    margin: "0 0 4px",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  navigationTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "16px",
  },

  navigationActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "10px 15px",
    fontSize: "11px",
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

  securityCard: {
    marginTop: "20px",
    background: "linear-gradient(135deg, #ecfdf5, #eff6ff)",
    border: "1px solid #bfdbfe",
    borderRadius: "17px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
  },

  securityIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  securityTitle: {
    margin: "0 0 5px",
    color: "#115e59",
    fontSize: "14px",
  },

  securityText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "11px",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    margin: "22px 0 5px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  emptyBox: {
    background: "white",
    border: "1px dashed #cbd5e1",
    borderRadius: "18px",
    padding: "55px 25px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "68px",
    height: "68px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    color: "#111827",
    fontSize: "20px",
  },

  emptyText: {
    margin: "0 auto 20px",
    maxWidth: "420px",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  errorPage: {
    maxWidth: "520px",
    margin: "80px auto",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  errorPageIcon: {
    width: "72px",
    height: "72px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  errorPageTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "21px",
  },

  errorPageText: {
    margin: "0 auto 20px",
    maxWidth: "400px",
    color: "#6b7280",
    fontSize: "12px",
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
    borderRadius: "19px",
    padding: "42px 35px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  loadingIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 17px",
    borderRadius: "50%",
    background: "#eff6ff",
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

export default PatientHistory;
