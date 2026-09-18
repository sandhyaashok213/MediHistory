import { useState, useEffect } from "react";
import axios from "axios";

function PatientProfile() {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  // =====================================
  // Load Patient Profile
  // =====================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/patient/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.profile) {
          setProfileExists(true);

          const profile = response.data.profile;

          setFormData({
            dateOfBirth: profile.date_of_birth
              ? profile.date_of_birth.substring(0, 10)
              : "",
            gender: profile.gender || "",
            phone: profile.phone || "",
            address: profile.address || "",
            emergencyContactName:
              profile.emergency_contact_name || "",
            emergencyContactPhone:
              profile.emergency_contact_phone || "",
            bloodGroup: profile.blood_group || "",
          });
        }
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Unable to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
  // Save Patient Profile
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        method: profileExists ? "put" : "post",
        url: "http://localhost:5000/api/patient/profile",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      // Profile now exists after a successful save
      setProfileExists(true);
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
    return <p>Loading profile...</p>;
  }

  // =====================================
  // Patient Profile UI
  // =====================================

  return (
    <div>
      <h1>My Profile</h1>

      <p>Personal Information</p>

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

        {/* Date of Birth */}
        <div>
          <label>Date of Birth</label>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Gender */}
        <div>
          <label>Gender</label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <br />

        {/* Phone */}
        <div>
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Address */}
        <div>
          <label>Address</label>

          <textarea
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <br />

        {/* Emergency Contact Name */}
        <div>
          <label>Emergency Contact Name</label>

          <input
            type="text"
            name="emergencyContactName"
            placeholder="Enter emergency contact name"
            value={formData.emergencyContactName}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Emergency Contact Phone */}
        <div>
          <label>Emergency Contact Phone</label>

          <input
            type="text"
            name="emergencyContactPhone"
            placeholder="Enter emergency contact phone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
          />
        </div>

        <br />

        {/* Blood Group */}
        <div>
          <label>Blood Group</label>

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          >
            <option value="">
              Select Blood Group
            </option>

            <option value="A+">
              A+
            </option>

            <option value="A-">
              A-
            </option>

            <option value="B+">
              B+
            </option>

            <option value="B-">
              B-
            </option>

            <option value="AB+">
              AB+
            </option>

            <option value="AB-">
              AB-
            </option>

            <option value="O+">
              O+
            </option>

            <option value="O-">
              O-
            </option>
          </select>
        </div>

        <br />

        {/* Save Button */}
        <button type="submit">
          Save Profile
        </button>

      </form>
    </div>
  );
}

export default PatientProfile;