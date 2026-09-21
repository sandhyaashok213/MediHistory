import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =====================================
// Patient Pages
// =====================================

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientHistory from "./pages/patient/PatientHistory";
import Medications from "./pages/patient/Medications";
import Allergies from "./pages/patient/Allergies";
import MedicalDocuments from "./pages/patient/MedicalDocuments";

// =====================================
// Doctor Pages
// =====================================

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Patients from "./pages/doctor/Patients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorPatientHistory from "./pages/doctor/PatientHistory";
import DoctorPatientMedications from "./pages/doctor/PatientMedications";
import DoctorMedicalDocuments from "./pages/doctor/MedicalDocuments";

// =====================================
// Admin Pages
// =====================================

import AdminDashboard from "./pages/admin/AdminDashboard";

// =====================================
// Other
// =====================================

import NotFound from "./pages/NotFound";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            Main Layout
        ===================================== */}

        <Route element={<Layout />}>

          {/* =====================================
              Public Routes
          ===================================== */}

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =====================================
              Protected Routes
          ===================================== */}

          <Route element={<ProtectedRoute />}>

            {/* =====================================
                Patient Routes
            ===================================== */}

            <Route
              path="/patient/dashboard"
              element={<PatientDashboard />}
            />

            <Route
              path="/patient/profile"
              element={<PatientProfile />}
            />

            <Route
              path="/patient/history"
              element={<PatientHistory />}
            />

            <Route
              path="/patient/medications"
              element={<Medications />}
            />

            <Route
              path="/patient/allergies"
              element={<Allergies />}
            />

            <Route
              path="/patient/documents"
              element={<MedicalDocuments />}
            />

            {/* =====================================
                Doctor Routes
            ===================================== */}

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/doctor/patients"
              element={<Patients />}
            />

            <Route
              path="/doctor/patients/:id"
              element={<PatientDetails />}
            />

            <Route
              path="/doctor/patients/:id/history"
              element={<DoctorPatientHistory />}
            />

            <Route
              path="/doctor/patients/:id/medications"
              element={<DoctorPatientMedications />}
            />

            <Route
              path="/doctor/patients/:id/documents"
              element={<DoctorMedicalDocuments />}
            />

            {/* =====================================
                Admin Routes
            ===================================== */}

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

          </Route>

          {/* =====================================
              404 Page
          ===================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;