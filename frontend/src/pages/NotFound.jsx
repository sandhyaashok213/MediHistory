function NotFound() {
  const handleGoHome = () => {
    window.location.href = "/login";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.iconCircle}>
          🩺
        </div>

        <p style={styles.label}>
          MEDIHISTORY
        </p>

        <h1 style={styles.errorCode}>
          404
        </h1>

        <h2 style={styles.title}>
          Page Not Found
        </h2>

        <p style={styles.description}>
          The page you are looking for doesn't exist or may have
          been moved to another location.
        </p>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleGoHome}
            style={styles.primaryButton}
          >
            🏠 Go to Login
          </button>

          <button
            onClick={handleGoBack}
            style={styles.secondaryButton}
          >
            ← Go Back
          </button>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>
            💡
          </div>

          <div>
            <h3 style={styles.infoTitle}>
              Need help?
            </h3>

            <p style={styles.infoText}>
              Check the URL or use the navigation menu to
              continue using MediHistory.
            </p>
          </div>
        </div>

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
    background:
      "linear-gradient(135deg, #f0fdfa 0%, #eff6ff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "650px",
    textAlign: "center",
  },

  iconCircle: {
    width: "90px",
    height: "90px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    boxShadow:
      "0 12px 30px rgba(15, 118, 110, 0.22)",
  },

  label: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#0f766e",
  },

  errorCode: {
    margin: "0",
    fontSize: "100px",
    lineHeight: "1",
    fontWeight: "900",
    letterSpacing: "-5px",
    background:
      "linear-gradient(135deg, #0f766e, #0e7490)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  title: {
    margin: "15px 0 10px",
    fontSize: "28px",
    color: "#111827",
    fontWeight: "800",
  },

  description: {
    maxWidth: "500px",
    margin: "0 auto",
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  primaryButton: {
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
      "0 6px 18px rgba(15, 118, 110, 0.2)",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "white",
    color: "#374151",
    padding: "13px 22px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  infoCard: {
    marginTop: "35px",
    background: "white",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    textAlign: "left",
    boxShadow:
      "0 6px 20px rgba(0, 0, 0, 0.04)",
  },

  infoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  infoTitle: {
    margin: "0 0 5px",
    fontSize: "15px",
    color: "#111827",
  },

  infoText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#6b7280",
  },

  footer: {
    marginTop: "28px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default NotFound;
