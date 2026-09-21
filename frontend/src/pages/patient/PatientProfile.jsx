import { useState, useEffect } from "react";
import axios from "axios";

function PatientProfile() {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/patient/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.profile) {
          setProfileExists(true);

          const profile = response.data.profile;

          setFormData({
            dateOfBirth: profile.date_of_birth
              ? profile.date_of_birth.substring(0, 10)
              : "",
            gender: profile.gender || "",
            phone: profile.phone || "",
            address: profile.address || "",
            emergencyContactName:
              profile.emergency_contact_name || "",
            emergencyContactPhone:
              profile.emergency_contact_phone || "",
            bloodGroup: profile.blood_group || "",
          });
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(
            error.response.data.message ||
              "Unable to load profile"
          );
        } else {
          setError("Unable to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios({
        method: profileExists ? "put" : "post",
        url: "http://localhost:5000/api/patient/profile",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(
        response.data.message ||
          "Profile saved successfully."
      );

      setProfileExists(true);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Unable to save profile"
        );
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>👤</div>

          <h2 style={styles.loadingTitle}>
            Loading Profile
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
              My Profile
            </h1>

            <p style={styles.headerSubtitle}>
              Manage your personal and emergency contact information.
            </p>
          </div>

          <div style={styles.headerIcon}>
            👤
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

        <form onSubmit={handleSubmit}>

          <section style={styles.formCard}>

            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Personal Information
                </h2>

                <p style={styles.sectionSubtitle}>
                  Keep your basic information up to date.
                </p>
              </div>

              <div style={styles.sectionIcon}>
                🧑
              </div>
            </div>

            <div style={styles.formGrid}>

              <div style={styles.field}>
                <label style={styles.label}>
                  🎂 Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  ⚧ Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  📱 Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  🩸 Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">
                    Select Blood Group
                  </option>

                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div style={styles.fieldFull}>
                <label style={styles.label}>
                  🏠 Address
                </label>

                <textarea
                  name="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  style={styles.textarea}
                />
              </div>

            </div>

          </section>

          <section style={styles.formCard}>

            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Emergency Contact
                </h2>

                <p style={styles.sectionSubtitle}>
                  Provide someone who can be contacted during an emergency.
                </p>
              </div>

              <div style={styles.emergencyIcon}>
                🚨
              </div>
            </div>

            <div style={styles.formGrid}>

              <div style={styles.field}>
                <label style={styles.label}>
                  👤 Contact Name
                </label>

                <input
                  type="text"
                  name="emergencyContactName"
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  📞 Contact Phone
                </label>

                <input
                  type="text"
                  name="emergencyContactPhone"
                  placeholder="Enter emergency contact phone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

            </div>

          </section>

          <section style={styles.saveCard}>

            <div>
              <h3 style={styles.saveTitle}>
                🔒 Keep your profile updated
              </h3>

              <p style={styles.saveText}>
                Accurate information helps your healthcare team
                provide better care.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "⏳ Saving..."
                : "✓ Save Profile"}
            </button>

          </section>

        </form>

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
    maxWidth: "1050px",
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
    marginBottom: "25px",
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
    lineHeight: "1.5",
  },

  sectionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  emergencyIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#fff7ed",
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

  saveCard: {
    background:
      "linear-gradient(135deg, #ecfdf5, #eff6ff)",
    border: "1px solid #bfdbfe",
    borderRadius: "18px",
    padding: "22px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  saveTitle: {
    margin: "0 0 5px",
    color: "#115e59",
    fontSize: "16px",
  },

  saveText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  saveButton: {
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    color: "white",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow:
      "0 5px 15px rgba(15,118,110,0.2)",
    whiteSpace: "nowrap",
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

export default PatientProfile;