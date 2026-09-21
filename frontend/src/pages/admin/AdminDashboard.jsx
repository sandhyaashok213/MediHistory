function AdminDashboard() {
  const administrationItems = [
    {
      icon: "👥",
      title: "Manage Patients",
      description: "View and manage registered patients.",
      color: "#0f766e",
    },
    {
      icon: "🩺",
      title: "Manage Doctors",
      description: "View and manage doctor accounts.",
      color: "#0e7490",
    },
    {
      icon: "🏥",
      title: "Manage Departments",
      description: "Manage hospital departments.",
      color: "#2563eb",
    },
    {
      icon: "📊",
      title: "View Statistics",
      description: "Monitor system activity and statistics.",
      color: "#7c3aed",
    },
    {
      icon: "📋",
      title: "Audit Logs",
      description: "Review important system activities.",
      color: "#c2410c",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <section style={styles.header}>
          <div>
            <p style={styles.headerLabel}>
              ADMIN PORTAL
            </p>

            <h1 style={styles.headerTitle}>
              Admin Dashboard
            </h1>

            <p style={styles.headerSubtitle}>
              Manage users, departments, statistics, and
              system activities from one place.
            </p>
          </div>

          <div style={styles.headerIcon}>
            🛡️
          </div>
        </section>

        {/* Welcome Card */}
        <section style={styles.welcomeCard}>
          <div style={styles.welcomeIcon}>
            👋
          </div>

          <div>
            <h2 style={styles.welcomeTitle}>
              Welcome to MediHistory Admin Portal
            </h2>

            <p style={styles.welcomeText}>
              Use the administration tools below to manage
              and monitor the MediHistory platform.
            </p>
          </div>
        </section>

        {/* Statistics Preview */}
        <section style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#ecfdf5",
              }}
            >
              👥
            </div>

            <div>
              <p style={styles.statLabel}>
                PATIENTS
              </p>

              <h3 style={styles.statValue}>
                —
              </h3>

              <p style={styles.statSubtext}>
                Registered patients
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#eff6ff",
              }}
            >
              🩺
            </div>

            <div>
              <p style={styles.statLabel}>
                DOCTORS
              </p>

              <h3 style={styles.statValue}>
                —
              </h3>

              <p style={styles.statSubtext}>
                Registered doctors
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#f5f3ff",
              }}
            >
              🏥
            </div>

            <div>
              <p style={styles.statLabel}>
                DEPARTMENTS
              </p>

              <h3 style={styles.statValue}>
                —
              </h3>

              <p style={styles.statSubtext}>
                Available departments
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fff7ed",
              }}
            >
              📋
            </div>

            <div>
              <p style={styles.statLabel}>
                AUDIT LOGS
              </p>

              <h3 style={styles.statValue}>
                —
              </h3>

              <p style={styles.statSubtext}>
                System activities
              </p>
            </div>
          </div>

        </section>

        {/* Administration */}
        <section style={styles.section}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Administration
              </h2>

              <p style={styles.sectionSubtitle}>
                Manage important areas of the MediHistory system.
              </p>
            </div>

            <div style={styles.sectionIcon}>
              ⚙️
            </div>
          </div>

          <div style={styles.adminGrid}>

            {administrationItems.map((item) => (
              <div
                key={item.title}
                style={{
                  ...styles.adminCard,
                  borderTop: `4px solid ${item.color}`,
                }}
              >
                <div
                  style={{
                    ...styles.adminIcon,
                    background: `${item.color}15`,
                  }}
                >
                  {item.icon}
                </div>

                <h3 style={styles.adminTitle}>
                  {item.title}
                </h3>

                <p style={styles.adminDescription}>
                  {item.description}
                </p>

                <button
                  style={{
                    ...styles.viewButton,
                    color: item.color,
                  }}
                >
                  Open
                  <span>→</span>
                </button>
              </div>
            ))}

          </div>
        </section>

        {/* Security Card */}
        <section style={styles.securityCard}>
          <div style={styles.securityIcon}>
            🔐
          </div>

          <div>
            <h3 style={styles.securityTitle}>
              Administrative Security
            </h3>

            <p style={styles.securityText}>
              Administrative activities should be performed
              carefully. Patient and healthcare information
              must be handled securely.
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
    marginBottom: "22px",
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

  headerTitle: {
    margin: "0 0 8px",
    fontSize: "32px",
    fontWeight: "800",
  },

  headerSubtitle: {
    margin: 0,
    maxWidth: "650px",
    fontSize: "14px",
    lineHeight: "1.6",
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

  welcomeCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "25px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.03)",
  },

  welcomeIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  welcomeTitle: {
    margin: "0 0 5px",
    fontSize: "17px",
    color: "#111827",
  },

  welcomeText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "30px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 5px 18px rgba(0,0,0,0.03)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  statLabel: {
    margin: 0,
    fontSize: "10px",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "1px",
  },

  statValue: {
    margin: "2px 0",
    fontSize: "25px",
    color: "#111827",
  },

  statSubtext: {
    margin: 0,
    fontSize: "11px",
    color: "#6b7280",
  },

  section: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "18px",
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

  sectionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  adminGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
  },

  adminCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    background: "#ffffff",
    transition: "transform 0.2s ease",
  },

  adminIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    marginBottom: "15px",
  },

  adminTitle: {
    margin: "0 0 7px",
    fontSize: "16px",
    color: "#111827",
  },

  adminDescription: {
    margin: "0 0 18px",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.5",
    minHeight: "36px",
  },

  viewButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "7px",
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
};

export default AdminDashboard;
