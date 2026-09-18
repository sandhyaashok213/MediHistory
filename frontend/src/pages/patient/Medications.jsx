import { useState, useEffect } from "react";
import axios from "axios";

function Medications() {
  const [medications, setMedications] = useState([]);

  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =====================================
  // Load Medications
  // =====================================

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/medications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMedications(response.data.medications || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load medications");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Handle Input Changes
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // Add Medication
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/patient/medications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      // Clear form
      setFormData({
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        reason: "",
      });

      // Reload medications
      fetchMedications();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  // =====================================
  // Delete Medication
  // =====================================

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/patient/medications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchMedications();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete medication");
      }
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return <p>Loading medications...</p>;
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div>
      <h1>My Medications</h1>

      <p>
        Add and manage your current medications.
      </p>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <hr />

      <h2>Add Medication</h2>

      <form onSubmit={handleSubmit}>

        {/* Medication Name */}
        <div>
          <label>
            Medication Name
          </label>

          <input
            type="text"
            name="medicationName"
            placeholder="Enter medication name"
            value={formData.medicationName}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* Dosage */}
        <div>
          <label>
            Dosage
          </label>

          <input
            type="text"
            name="dosage"
            placeholder="Example: 500 mg"
            value={formData.dosage}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Frequency */}
        <div>
          <label>
            Frequency
          </label>

          <input
            type="text"
            name="frequency"
            placeholder="Example: Twice a day"
            value={formData.frequency}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Duration */}
        <div>
          <label>
            Duration
          </label>

          <input
            type="text"
            name="duration"
            placeholder="Example: 5 days"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Reason */}
        <div>
          <label>
            Reason
          </label>

          <textarea
            name="reason"
            placeholder="Why are you taking this medication?"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <br />

        <button type="submit">
          Add Medication
        </button>

      </form>

      <hr />

      <h2>Current Medications</h2>

      {medications.length === 0 ? (
        <p>
          No medications added yet.
        </p>
      ) : (
        <ul>
          {medications.map((medication) => (
            <li key={medication.id}>

              <strong>
                {medication.medication_name}
              </strong>

              <br />

              Dosage:{" "}
              {medication.dosage || "Not provided"}

              <br />

              Frequency:{" "}
              {medication.frequency || "Not provided"}

              <br />

              Duration:{" "}
              {medication.duration || "Not provided"}

              <br />

              Reason:{" "}
              {medication.reason || "Not provided"}

              <br />

              <button
                onClick={() =>
                  handleDelete(medication.id)
                }
              >
                Delete
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Medications;