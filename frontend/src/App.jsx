import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientHistory from "./pages/patient/PatientHistory";
import Medications from "./pages/patient/Medications";
import Allergies from "./pages/patient/Allergies";
import MedicalDocuments from "./pages/patient/MedicalDocuments";

import NotFound from "./pages/NotFound";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          {/* Public Routes */}
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            <Route
              path="/patient/dashboard"
              element={<PatientDashboard />}
            />

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={<NotFound />}
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
        </Route>

        <Route
  path="/patient/documents"
  element={<MedicalDocuments />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;