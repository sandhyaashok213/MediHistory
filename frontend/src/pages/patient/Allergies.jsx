import { useState, useEffect } from "react";
import axios from "axios";

function Allergies() {
  const [allergies, setAllergies] = useState([]);

  const [formData, setFormData] = useState({
    allergen: "",
    reaction: "",
    severity: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/allergies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllergies(response.data.allergies || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to load allergies"
        );
      } else {
        setError("Unable to load allergies");
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
        "http://localhost:5000/api/patient/allergies",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Allergy added successfully."
      );

      setFormData({
        allergen: "",
        reaction: "",
        severity: "",
      });

      fetchAllergies();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to add allergy"
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
        `http://localhost:5000/api/patient/allergies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Allergy deleted successfully."
      );

      fetchAllergies();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to delete allergy"
        );
      } else {
        setError("Unable to delete allergy");
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>⚠️</div>

          <h2 style={styles.loadingTitle}>
            Loading Allergies
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
              My Allergies
            </h1>

            <p style={styles.headerSubtitle}>
              Keep your known allergies updated for your healthcare team.
            </p>
          </div>

          <div style={styles.headerIcon}>
            ⚠️
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
                Add Allergy
              </h2>

              <p style={styles.sectionSubtitle}>
                Record an allergy and the reaction it causes.
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
                  ⚠️ Allergen
                </label>

                <input
                  type="text"
                  name="allergen"
                  placeholder="Example: Penicillin"
                  value={formData.allergen}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  🩺 Reaction
                </label>

                <input
                  type="text"
                  name="reaction"
                  placeholder="Example: Skin rash"
                  value={formData.reaction}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  🚨 Severity
                </label>

                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">
                    Select Severity
                  </option>

                  <option value="Mild">
                    Mild
                  </option>

                  <option value="Moderate">
                    Moderate
                  </option>

                  <option value="Severe">
                    Severe
                  </option>
                </select>
              </div>

            </div>

            <div style={styles.formFooter}>
              <div style={styles.securityText}>
                🔒 Your allergy information is securely stored.
              </div>

              <button
                type="submit"
                style={styles.addButton}
              >
                ➕ Add Allergy
              </button>
            </div>

          </form>
        </section>

        <section style={styles.allergiesSection}>

          <div style={styles.listHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Recorded Allergies
              </h2>

              <p style={styles.sectionSubtitle}>
                Your currently recorded allergies.
              </p>
            </div>

            <div style={styles.countBadge}>
              {allergies.length}{" "}
              {allergies.length === 1
                ? "Allergy"
                : "Allergies"}
            </div>

          </div>

          {allergies.length === 0 ? (
            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                🛡️
              </div>

              <h3 style={styles.emptyTitle}>
                No Allergies Added
              </h3>

              <p style={styles.emptyText}>
                You have not added any known allergies yet.
                Use the form above to add one.
              </p>

            </div>
          ) : (
            <div style={styles.allergyGrid}>

              {allergies.map((allergy) => (

                <div
                  key={allergy.id}
                  style={styles.allergyCard}
                >

                  <div style={styles.allergyTop}>

                    <div style={styles.allergyIcon}>
                      ⚠️
                    </div>

                    <div style={styles.allergyNameArea}>

                      <h3 style={styles.allergyName}>
                        {allergy.allergen}
                      </h3>

                      <span
                        style={
                          allergy.severity === "Severe"
                            ? styles.severeBadge
                            : allergy.severity === "Moderate"
                            ? styles.moderateBadge
                            : styles.mildBadge
                        }
                      >
                        {allergy.severity ||
                          "Severity Not Provided"}
                      </span>

                    </div>

                  </div>

                  <div style={styles.detailsBox}>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Reaction
                      </span>

                      <strong style={styles.detailValue}>
                        {allergy.reaction ||
                          "Not provided"}
                      </strong>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        Severity
                      </span>

                      <strong style={styles.detailValue}>
                        {allergy.severity ||
                          "Not provided"}
                      </strong>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(allergy.id)
                    }
                    style={styles.deleteButton}
                  >
                    🗑️ Delete Allergy
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

        <div style={styles.warningCard}>

          <div style={styles.warningIcon}>
            🚨
          </div>

          <div>
            <h3 style={styles.warningTitle}>
              Allergy Safety
            </h3>

            <p style={styles.warningText}>
              Keep your allergy information accurate and
              inform your doctor about any new or severe reactions.
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
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
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

  allergiesSection: {
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

  allergyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  allergyCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "23px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
  },

  allergyTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  allergyIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#fff7ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  allergyNameArea: {
    flex: 1,
  },

  allergyName: {
    margin: "0 0 7px",
    fontSize: "18px",
    color: "#111827",
  },

  mildBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "20px",
    padding: "4px 9px",
    fontSize: "10px",
    fontWeight: "700",
  },

  moderateBadge: {
    display: "inline-block",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "20px",
    padding: "4px 9px",
    fontSize: "10px",
    fontWeight: "700",
  },

  severeBadge: {
    display: "inline-block",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "20px",
    padding: "4px 9px",
    fontSize: "10px",
    fontWeight: "700",
  },

  detailsBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },

  detailItem: {
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "13px",
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

  warningCard: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "15px",
    padding: "20px 23px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },

  warningIcon: {
    fontSize: "21px",
  },

  warningTitle: {
    margin: "0 0 5px",
    color: "#9a3412",
    fontSize: "15px",
  },

  warningText: {
    margin: 0,
    color: "#c2410c",
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

export default Allergies;