import { useState, useEffect } from "react";
import axios from "axios";

function PatientHistory() {
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    pastMedicalHistory: "",
    pastSurgicalHistory: "",
    personalHistory: "",
    familyHistory: "",
    reviewOfSystems: "",
  });

  const [historyExists, setHistoryExists] = useState(false);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =====================================
  // Load Existing Patient History
  // =====================================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/patient/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.history) {
          setHistoryExists(true);

          const history = response.data.history;

          setFormData({
            chiefComplaint:
              history.chief_complaint || "",

            historyOfPresentIllness:
              history.history_of_present_illness || "",

            pastMedicalHistory:
              history.past_medical_history || "",

            pastSurgicalHistory:
              history.past_surgical_history || "",

            personalHistory:
              history.personal_history || "",

            familyHistory:
              history.family_history || "",

            reviewOfSystems:
              history.review_of_systems || "",
          });
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Unable to load patient history");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
  // Save Patient History
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: historyExists ? "put" : "post",
        url: "http://localhost:5000/api/patient/history",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      // History now exists
      setHistoryExists(true);
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
  // Loading
  // =====================================

  if (loading) {
    return <p>Loading patient history...</p>;
  }

  // =====================================
  // Patient History UI
  // =====================================

  return (
    <div>
      <h1>My Medical History</h1>

      <p>
        Please provide your medical history for the doctor.
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

      <form onSubmit={handleSubmit}>

        {/* Chief Complaint */}
        <div>
          <label>
            Chief Complaint
          </label>

          <textarea
            name="chiefComplaint"
            placeholder="What is your main health problem?"
            value={formData.chiefComplaint}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <br />

        {/* History of Present Illness */}
        <div>
          <label>
            History of Present Illness
          </label>

          <textarea
            name="historyOfPresentIllness"
            placeholder="Describe your current health problem, when it started, symptoms, etc."
            value={formData.historyOfPresentIllness}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Past Medical History */}
        <div>
          <label>
            Past Medical History
          </label>

          <textarea
            name="pastMedicalHistory"
            placeholder="Mention previous illnesses, diseases, conditions, etc."
            value={formData.pastMedicalHistory}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Past Surgical History */}
        <div>
          <label>
            Past Surgical History
          </label>

          <textarea
            name="pastSurgicalHistory"
            placeholder="Mention previous surgeries or operations."
            value={formData.pastSurgicalHistory}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Personal History */}
        <div>
          <label>
            Personal History
          </label>

          <textarea
            name="personalHistory"
            placeholder="Mention lifestyle, food habits, sleep, smoking, alcohol, etc."
            value={formData.personalHistory}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Family History */}
        <div>
          <label>
            Family History
          </label>

          <textarea
            name="familyHistory"
            placeholder="Mention diseases or medical conditions in your family."
            value={formData.familyHistory}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Review of Systems */}
        <div>
          <label>
            Review of Systems
          </label>

          <textarea
            name="reviewOfSystems"
            placeholder="Mention other symptoms or health problems affecting different body systems."
            value={formData.reviewOfSystems}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <br />

        {/* Save Button */}
        <button type="submit">
          Save Medical History
        </button>

      </form>
    </div>
  );
}

export default PatientHistory;