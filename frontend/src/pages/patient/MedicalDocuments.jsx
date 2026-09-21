import { useState, useEffect } from "react";
import axios from "axios";

function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        setError("Unable to load medical documents");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a medical document");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("medicalDocument", file);
      formData.append("documentType", documentType);

      const response = await axios.post(
        "http://localhost:5000/api/patient/documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Medical document uploaded successfully."
      );

      setFile(null);
      setDocumentType("");

      const fileInput =
        document.getElementById("medicalDocument");

      if (fileInput) {
        fileInput.value = "";
      }

      fetchDocuments();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to upload medical document"
        );
      } else {
        setError(
          "Unable to upload medical document"
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/patient/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Medical document deleted successfully."
      );

      fetchDocuments();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to delete medical document"
        );
      } else {
        setError(
          "Unable to delete medical document"
        );
      }
    }
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return styles.completedBadge;
    }

    if (status === "failed") {
      return styles.failedBadge;
    }

    return styles.pendingBadge;
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>📄</div>

          <h2 style={styles.loadingTitle}>
            Loading Documents
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
              My Medical Documents
            </h1>

            <p style={styles.headerSubtitle}>
              Upload and manage your medical reports securely.
            </p>
          </div>

          <div style={styles.headerIcon}>
            📄
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

        <section style={styles.uploadCard}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Upload Medical Document
              </h2>

              <p style={styles.sectionSubtitle}>
                Upload your medical report for OCR and AI processing.
              </p>
            </div>

            <div style={styles.uploadIcon}>
              ⬆️
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.uploadArea}>

              <div style={styles.uploadAreaIcon}>
                📁
              </div>

              <h3 style={styles.uploadTitle}>
                Select your medical document
              </h3>

              <p style={styles.uploadDescription}>
                Supported formats: PDF, JPG, JPEG and PNG
              </p>

              <input
                id="medicalDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={styles.fileInput}
              />

              {file && (
                <div style={styles.selectedFile}>
                  <span style={styles.selectedFileIcon}>
                    📄
                  </span>

                  <div>
                    <strong>
                      {file.name}
                    </strong>

                    <p>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                📋 Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value)
                }
                style={styles.select}
              >
                <option value="">
                  Select Document Type
                </option>

                <option value="Blood Report">
                  Blood Report
                </option>

                <option value="Prescription">
                  Prescription
                </option>

                <option value="Scan Report">
                  Scan Report
                </option>

                <option value="Medical Report">
                  Medical Report
                </option>

                <option value="Discharge Summary">
                  Discharge Summary
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div style={styles.uploadFooter}>

              <div style={styles.securityText}>
                🔒 Your medical documents are securely processed.
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  ...styles.uploadButton,
                  opacity: uploading ? 0.7 : 1,
                  cursor: uploading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {uploading
                  ? "⏳ Uploading..."
                  : "⬆️ Upload Document"}
              </button>

            </div>

          </form>
        </section>

        <section style={styles.documentsSection}>

          <div style={styles.listHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                My Documents
              </h2>

              <p style={styles.sectionSubtitle}>
                Your uploaded medical reports and AI summaries.
              </p>
            </div>

            <div style={styles.countBadge}>
              {documents.length}{" "}
              {documents.length === 1
                ? "Document"
                : "Documents"}
            </div>

          </div>

          {documents.length === 0 ? (
            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                📂
              </div>

              <h3 style={styles.emptyTitle}>
                No Medical Documents
              </h3>

              <p style={styles.emptyText}>
                You have not uploaded any medical documents yet.
                Upload a document using the form above.
              </p>

            </div>
          ) : (
            <div style={styles.documentGrid}>

              {documents.map((document) => (

                <div
                  key={document.id}
                  style={styles.documentCard}
                >

                  <div style={styles.documentHeader}>

                    <div style={styles.documentIcon}>
                      📄
                    </div>

                    <div style={styles.documentNameArea}>

                      <h3 style={styles.documentName}>
                        {document.file_name}
                      </h3>

                      <span style={styles.documentType}>
                        {document.document_type ||
                          "Medical Document"}
                      </span>

                    </div>

                  </div>

                  <div style={styles.statusRow}>

                    <span style={styles.statusLabel}>
                      Processing Status
                    </span>

                    <span
                      style={getStatusStyle(
                        document.processing_status
                      )}
                    >
                      {document.processing_status ||
                        "Pending"}
                    </span>

                  </div>

                  {document.ocr_text && (
                    <div style={styles.contentSection}>

                      <div style={styles.contentTitle}>
                        <span>🔎</span>
                        OCR Extracted Text
                      </div>

                      <pre style={styles.ocrText}>
                        {document.ocr_text}
                      </pre>

                    </div>
                  )}

                  {document.ai_summary && (
                    <div style={styles.summarySection}>

                      <div style={styles.summaryTitle}>
                        <span>🤖</span>
                        AI Medical Summary
                      </div>

                      <pre style={styles.summaryText}>
                        {document.ai_summary}
                      </pre>

                      <div style={styles.reviewNote}>
                        🩺 Doctor review is recommended before
                        relying on the extracted information.
                      </div>

                    </div>
                  )}

                  <div style={styles.documentFooter}>

                    <div style={styles.uploadDate}>
                      <span>📅</span>

                      {document.upload_date
                        ? new Date(
                            document.upload_date
                          ).toLocaleString()
                        : "Date not available"}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(document.id)
                      }
                      style={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

        <div style={styles.infoCard}>

          <div style={styles.infoIcon}>
            🔐
          </div>

          <div>
            <h3 style={styles.infoTitle}>
              Medical Document Privacy
            </h3>

            <p style={styles.infoText}>
              Your uploaded documents are processed to extract
              medical information and generate summaries.
              Always verify important information with your doctor.
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

  uploadCard: {
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

  uploadIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  uploadArea: {
    border: "2px dashed #a7f3d0",
    borderRadius: "16px",
    background: "#f0fdfa",
    padding: "35px 25px",
    textAlign: "center",
    marginBottom: "25px",
  },

  uploadAreaIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  uploadTitle: {
    margin: "0 0 7px",
    color: "#111827",
    fontSize: "18px",
  },

  uploadDescription: {
    margin: "0 0 20px",
    color: "#6b7280",
    fontSize: "13px",
  },

  fileInput: {
    display: "block",
    margin: "0 auto",
    maxWidth: "100%",
    fontSize: "13px",
  },

  selectedFile: {
    maxWidth: "500px",
    margin: "20px auto 0",
    background: "white",
    border: "1px solid #d1fae5",
    borderRadius: "12px",
    padding: "12px 15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
  },

  selectedFileIcon: {
    fontSize: "25px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
  },

  label: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
  },

  select: {
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
    cursor: "pointer",
  },

  uploadFooter: {
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

  uploadButton: {
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow:
      "0 5px 15px rgba(15,118,110,0.2)",
  },

  documentsSection: {
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

  documentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "20px",
  },

  documentCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "23px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },

  documentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  documentIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  documentNameArea: {
    flex: 1,
    minWidth: 0,
  },

  documentName: {
    margin: "0 0 7px",
    fontSize: "17px",
    color: "#111827",
    wordBreak: "break-word",
  },

  documentType: {
    display: "inline-block",
    background: "#f3f4f6",
    color: "#4b5563",
    borderRadius: "20px",
    padding: "4px 9px",
    fontSize: "10px",
    fontWeight: "700",
  },

  statusRow: {
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "11px 13px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  statusLabel: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "600",
  },

  completedBadge: {
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "10px",
    fontWeight: "700",
  },

  pendingBadge: {
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "10px",
    fontWeight: "700",
  },

  failedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "20px",
    padding: "5px 10px",
    fontSize: "10px",
    fontWeight: "700",
  },

  contentSection: {
    marginBottom: "18px",
  },

  contentTitle: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "9px",
  },

  ocrText: {
    whiteSpace: "pre-wrap",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    margin: 0,
    maxHeight: "250px",
    overflowY: "auto",
    overflowX: "auto",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#4b5563",
    fontFamily: "monospace",
  },

  summarySection: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "18px",
  },

  summaryTitle: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: "10px",
  },

  summaryText: {
    whiteSpace: "pre-wrap",
    background: "white",
    borderRadius: "9px",
    padding: "13px",
    margin: 0,
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "auto",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#374151",
    fontFamily: "monospace",
  },

  reviewNote: {
    marginTop: "10px",
    color: "#1d4ed8",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  documentFooter: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  uploadDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#6b7280",
    fontSize: "11px",
  },

  deleteButton: {
    border: "1px solid #fecaca",
    borderRadius: "9px",
    background: "#fff",
    color: "#dc2626",
    padding: "9px 13px",
    fontSize: "12px",
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
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
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
    color: "#115e59",
    fontSize: "15px",
  },

  infoText: {
    margin: 0,
    color: "#0f766e",
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

export default MedicalDocuments;