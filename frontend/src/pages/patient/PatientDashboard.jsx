import { Link } from "react-router-dom";

function PatientDashboard() {
  const services = [
    {
      title: "My Profile",
      description: "View and manage your personal information",
      icon: "👤",
      path: "/patient/profile",
    },
    {
      title: "Medical History",
      description: "View your previous medical history",
      icon: "📋",
      path: "/patient/history",
    },
    {
      title: "Medications",
      description: "View your current and previous medications",
      icon: "💊",
      path: "/patient/medications",
    },
    {
      title: "Allergies",
      description: "View your recorded allergies",
      icon: "⚠️",
      path: "/patient/allergies",
    },
    {
      title: "Medical Documents",
      description: "Upload and view your medical reports",
      icon: "📄",
      path: "/patient/documents",
    },
  ];

  const styles = {
    page: {
      minHeight: "calc(100vh - 70px)",
      background: "#f5f8fc",
      padding: "40px 6%",
      color: "#1f2937",
    },
    header: {
      background: "linear-gradient(135deg, #0f766e, #0e7490)",
      borderRadius: "20px",
      padding: "38px 42px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
      boxShadow: "0 10px 30px rgba(15, 118, 110, 0.18)",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "1.5px",
      marginBottom: "8px",
      opacity: 0.85,
    },
    title: {
      fontSize: "34px",
      margin: "0 0 10px",
    },
    subtitle: {
      margin: 0,
      fontSize: "16px",
      opacity: 0.9,
    },
    heart: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "36px",
    },
    section: {
      marginBottom: "40px",
    },
    heading: {
      marginBottom: "22px",
    },
    headingTitle: {
      margin: "0 0 6px",
      fontSize: "24px",
      color: "#111827",
    },
    headingText: {
      margin: 0,
      color: "#6b7280",
      fontSize: "14px",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
    },
    serviceCard: {
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid #e5e7eb",
      display: "flex",
      gap: "18px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
    },
    serviceIcon: {
      width: "52px",
      height: "52px",
      flexShrink: 0,
      borderRadius: "14px",
      background: "#ecfdf5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "25px",
    },
    serviceContent: {
      flex: 1,
    },
    serviceTitle: {
      margin: "0 0 7px",
      fontSize: "17px",
      color: "#111827",
    },
    serviceDescription: {
      margin: "0 0 14px",
      color: "#6b7280",
      fontSize: "13px",
      lineHeight: "1.5",
    },
    serviceLink: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#0f766e",
    },
    healthGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "15px",
    },
    healthItem: {
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "18px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    healthIcon: {
      width: "42px",
      height: "42px",
      borderRadius: "10px",
      background: "#f0fdfa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      flexShrink: 0,
    },
    healthTitle: {
      display: "block",
      fontSize: "14px",
      color: "#1f2937",
      marginBottom: "4px",
    },
    healthText: {
      margin: 0,
      fontSize: "12px",
      color: "#6b7280",
    },
    security: {
      background: "#ecfdf5",
      border: "1px solid #a7f3d0",
      borderRadius: "16px",
      padding: "22px 25px",
      display: "flex",
      alignItems: "center",
      gap: "18px",
      marginBottom: "20px",
    },
    securityIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      flexShrink: 0,
    },
    securityTitle: {
      margin: "0 0 5px",
      fontSize: "16px",
      color: "#065f46",
    },
    securityText: {
      margin: 0,
      fontSize: "13px",
      color: "#047857",
    },
  };

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.label}>PATIENT PORTAL</p>

          <h1 style={styles.title}>
            Welcome to MediHistory
          </h1>

          <p style={styles.subtitle}>
            Manage your medical information securely in one place.
          </p>
        </div>

        <div style={styles.heart}>
          ❤️
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.heading}>
          <h2 style={styles.headingTitle}>
            Patient Services
          </h2>

          <p style={styles.headingText}>
            Access your health information and medical records.
          </p>
        </div>

        <div style={styles.servicesGrid}>
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.path}
              style={styles.serviceCard}
            >
              <div style={styles.serviceIcon}>
                {service.icon}
              </div>

              <div style={styles.serviceContent}>
                <h3 style={styles.serviceTitle}>
                  {service.title}
                </h3>

                <p style={styles.serviceDescription}>
                  {service.description}
                </p>

                <span style={styles.serviceLink}>
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.heading}>
          <h2 style={styles.headingTitle}>
            My Health History
          </h2>

          <p style={styles.headingText}>
            Your medical information is organized for easy access.
          </p>
        </div>

        <div style={styles.healthGrid}>
          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>👤</span>
            <div>
              <strong style={styles.healthTitle}>
                Personal Information
              </strong>
              <p style={styles.healthText}>
                Your basic profile information
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>📋</span>
            <div>
              <strong style={styles.healthTitle}>
                Medical History
              </strong>
              <p style={styles.healthText}>
                Your previous medical records
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>💊</span>
            <div>
              <strong style={styles.healthTitle}>
                Medications
              </strong>
              <p style={styles.healthText}>
                Your medication records
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>⚠️</span>
            <div>
              <strong style={styles.healthTitle}>
                Allergies
              </strong>
              <p style={styles.healthText}>
                Your recorded allergies
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>👨‍👩‍👧</span>
            <div>
              <strong style={styles.healthTitle}>
                Family History
              </strong>
              <p style={styles.healthText}>
                Your family medical history
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>📄</span>
            <div>
              <strong style={styles.healthTitle}>
                Medical Documents
              </strong>
              <p style={styles.healthText}>
                Your uploaded medical reports
              </p>
            </div>
          </div>

          <div style={styles.healthItem}>
            <span style={styles.healthIcon}>🕒</span>
            <div>
              <strong style={styles.healthTitle}>
                Medical Timeline
              </strong>
              <p style={styles.healthText}>
                Your medical events over time
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.security}>
        <div style={styles.securityIcon}>
          🔒
        </div>

        <div>
          <h3 style={styles.securityTitle}>
            Your Health Information is Secure
          </h3>

          <p style={styles.securityText}>
            MediHistory is designed to keep your medical information organized and protected.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PatientDashboard;