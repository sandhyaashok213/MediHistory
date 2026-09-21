import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientHistory from "./pages/patient/PatientHistory";
import Medications from "./pages/patient/Medications";
import Allergies from "./pages/patient/Allergies";
import MedicalDocuments from "./pages/patient/MedicalDocuments";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Patients from "./pages/doctor/Patients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorPatientHistory from "./pages/doctor/PatientHistory";
import DoctorPatientMedications from "./pages/doctor/PatientMedications";
import DoctorMedicalDocuments from "./pages/doctor/MedicalDocuments";

import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>

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

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>
    </Routes>
  );
}

export default AppRoutes;
