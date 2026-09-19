import { useState, useEffect } from "react";
import axios from "axios";

function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);

  const [file, setFile] = useState(null);

  const [documentType, setDocumentType] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =====================================
  // Get Documents
  // =====================================

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/patient/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load medical documents");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Select File
  // =====================================

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // =====================================
  // Upload File
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a medical document");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("medicalDocument", file);
      formData.append("documentType", documentType);

      const response = await axios.post(
        "http://localhost:5000/api/patient/documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);

      setFile(null);
      setDocumentType("");

      // Reset file input
      document.getElementById("medicalDocument").value = "";

      fetchDocuments();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to upload medical document");
      }
    }
  };

  // =====================================
  // Delete Document
  // =====================================

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/patient/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchDocuments();
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete medical document");
      }
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return <p>Loading medical documents...</p>;
  }

  // =====================================
  // Page
  // =====================================

  return (
    <div>
      <h1>My Medical Documents</h1>

      <p>
        Upload and manage your medical reports and documents.
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

      <h2>Upload Medical Document</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select File</label>

          <br />

          <input
            id="medicalDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </div>

        <br />

        <div>
          <label>Document Type</label>

          <br />

          <select
            value={documentType}
            onChange={(e) =>
              setDocumentType(e.target.value)
            }
          >
            <option value="">
              Select Document Type
            </option>

            <option value="Blood Report">
              Blood Report
            </option>

            <option value="Prescription">
              Prescription
            </option>

            <option value="Scan Report">
              Scan Report
            </option>

            <option value="Medical Report">
              Medical Report
            </option>

            <option value="Discharge Summary">
              Discharge Summary
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <br />

        <button type="submit">
          Upload Document
        </button>
      </form>

      <hr />

      <h2>My Documents</h2>

      {documents.length === 0 ? (
        <p>
          No medical documents uploaded yet.
        </p>
      ) : (
        <ul>
          {documents.map((document) => (
            <li key={document.id}>
              <strong>
                {document.file_name}
              </strong>

              <br />

              Document Type:{" "}
              {document.document_type || "Not provided"}

              <br />

              Processing Status:{" "}
              {document.processing_status || "Pending"}

              <br />

              Upload Date:{" "}
              {document.upload_date
                ? new Date(
                    document.upload_date
                  ).toLocaleString()
                : "Not available"}

              <br />

              <button
                onClick={() =>
                  handleDelete(document.id)
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

export default MedicalDocuments;