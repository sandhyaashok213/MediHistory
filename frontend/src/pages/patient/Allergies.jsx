import { useState, useEffect } from "react";
import axios from "axios";

function Allergies() {
  const [allergies, setAllergies] = useState([]);

  const [formData, setFormData] = useState({
    allergen: "",
    reaction: "",
    severity: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/allergies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllergies(response.data.allergies || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load allergies");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/patient/allergies",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setFormData({
        allergen: "",
        reaction: "",
        severity: "",
      });

      fetchAllergies();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to connect to the server");
      }
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/patient/allergies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchAllergies();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete allergy");
      }
    }
  };

  if (loading) {
    return <p>Loading allergies...</p>;
  }

  return (
    <div>
      <h1>My Allergies</h1>

      <p>
        Add and manage your known allergies.
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

      <h2>Add Allergy</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Allergen</label>

          <input
            type="text"
            name="allergen"
            placeholder="Example: Penicillin"
            value={formData.allergen}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Reaction</label>

          <input
            type="text"
            name="reaction"
            placeholder="Example: Skin rash"
            value={formData.reaction}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Severity</label>

          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="">Select Severity</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        <br />

        <button type="submit">
          Add Allergy
        </button>
      </form>

      <hr />

      <h2>My Allergies</h2>

      {allergies.length === 0 ? (
        <p>No allergies added yet.</p>
      ) : (
        <ul>
          {allergies.map((allergy) => (
            <li key={allergy.id}>
              <strong>
                {allergy.allergen}
              </strong>

              <br />

              Reaction:{" "}
              {allergy.reaction || "Not provided"}

              <br />

              Severity:{" "}
              {allergy.severity || "Not provided"}

              <br />

              <button
                onClick={() =>
                  handleDelete(allergy.id)
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

export default Allergies;