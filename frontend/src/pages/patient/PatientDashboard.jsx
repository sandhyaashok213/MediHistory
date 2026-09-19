
import { Link } from "react-router-dom";

function PatientDashboard() {
  return (
    <div>
      <h1>Patient Dashboard</h1>

      <p>
        Welcome to your MediHistory dashboard.
      </p>

      <hr />

      <h2>Patient Services</h2>

      {/* My Profile */}
      <div>
        <Link to="/patient/profile">
          <button>
            My Profile
          </button>
        </Link>
      </div>

      <br />

      {/* Medical History */}
      <div>
        <Link to="/patient/history">
          <button>
            My Medical History
          </button>
        </Link>
      </div>

      <br />

      {/* Medications */}
      <div>
        <Link to="/patient/medications">
          <button>
            My Medications
          </button>
        </Link>
      </div>

      <br />

      {/* Allergies */}
      <div>
        <Link to="/patient/allergies">
          <button>
            My Allergies
          </button>
        </Link>
      </div>

      <br />

      {/* Medical Documents */}
      <div>
        <Link to="/patient/documents">
          <button>
            My Medical Documents
          </button>
        </Link>
      </div>

      <hr />

      <h2>My Health History</h2>

      <ul>
        <li>Personal Information</li>
        <li>Medical History</li>
        <li>Medications</li>
        <li>Allergies</li>
        <li>Family History</li>
        <li>Medical Documents</li>
        <li>Medical Timeline</li>
      </ul>
    </div>
  );
}

export default PatientDashboard;
