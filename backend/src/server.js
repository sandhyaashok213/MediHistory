const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const medicationRoutes = require("./routes/medicationRoutes");
const allergyRoutes = require("./routes/allergyRoutes");
const medicalDocumentRoutes = require("./routes/medicalDocumentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/patient", historyRoutes);
app.use("/api/patient", allergyRoutes);
app.use("/api/patient", medicationRoutes);
app.use("/api/patient", medicalDocumentRoutes);
app.use("/api/doctor", doctorRoutes);

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "MediHistory Backend is running",
  });
});

// Test backend + MySQL
app.get("/api/health", (req, res) => {
  db.query("SELECT 1 AS result", (err, results) => {
    if (err) {
      console.error("Database query failed:", err.message);

      return res.status(500).json({
        success: false,
        message: "Database query failed",
      });
    }

    res.json({
      success: true,
      message: "MediHistory API and database are working",
      database: results[0].result === 1,
    });
  });
});

// Protected Test Route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "You have access to the protected route",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediHistory server running on port ${PORT}`);
});