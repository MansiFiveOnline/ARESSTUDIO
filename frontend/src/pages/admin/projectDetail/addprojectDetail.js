import React, { useEffect, useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProjectDetail = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [media, setMedia] = useState({ iframe: "", file: null });
  const [posterImg, setPosterImg] = useState(null);
  const [validationError, setValidationError] = useState(""); // State for validation error message
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/project/projectname`);
        const sortedProjectNames = response.data.projectNames.sort((a, b) =>
          a.localeCompare(b)
        );
        setProjectNames(sortedProjectNames);
      } catch (error) {
        console.error("Error fetching project names:", error);
      }
    };

    fetchProjectNames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!media.iframe && !media.file) {
      setValidationError("Please provide either an iFrame URL or an image.");
      return;
    }

    if (media.iframe && media.file) {
      setValidationError(
        "Please provide either an iFrame URL or an image, not both."
      );
      return;
    }

    if (media.iframe && !posterImg) {
      setValidationError(
        "Poster image is required when an iFrame URL is provided."
      );
      return;
    }

    // New validation to ensure both media and posterImg are not provided when media type is image
    if (media.file && posterImg) {
      setValidationError(
        "Please provide either a media image or a poster image, not both."
      );
      return;
    }

    setValidationError("");

    try {
      const formData = new FormData();
      formData.append("project_name", selectedProjectName);

      if (media.iframe) {
        formData.append("media", media.iframe);
      } else if (media.file) {
        formData.append("media", media.file); // Ensure this name matches the expected field name
      }

      if (posterImg) {
        formData.append("posterImg", posterImg);
      }

      // Debugging: Log FormData content
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.post(
        `${apiUrl}/api/project_detail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(response.data.newProjectDetail);
      navigate("/admin/project_detail");
    } catch (error) {
      console.error("Error creating project detail:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Add Project Detail</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Project Name</label>
                <select
                  value={selectedProjectName}
                  required
                  onChange={(e) => setSelectedProjectName(e.target.value)}
                >
                  <option value="" disabled>
                    Select a project name
                  </option>
                  {projectNames.map((projectName, index) => (
                    <option key={index} value={projectName}>
                      {projectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Media (1920 X 1000)</label>
                <input
                  type="text"
                  name="media"
                  value={media.iframe}
                  placeholder="iFrame URL"
                  onChange={(e) =>
                    setMedia({
                      ...media,
                      iframe: e.target.value,
                      file: null,
                    })
                  }
                />
                <span> OR </span>
                <input
                  type="file"
                  name="mediaFile"
                  accept=".webp"
                  onChange={(e) =>
                    setMedia({
                      ...media,
                      file: e.target.files[0],
                      iframe: "",
                    })
                  }
                />
              </div>
              {validationError && (
                <div className="col-12">
                  <div className="theme-form">
                    <span className="text-danger">{validationError}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Poster Image (for iPhone)</label>
                <input
                  type="file"
                  name="posterImg"
                  accept=".webp"
                  onChange={(e) => setPosterImg(e.target.files[0])}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="error-message text-danger mt-2">
                {errorMessage}
              </div>
            )}

            <div className="col-12">
              <div className="theme-form">
                <button type="submit">Save</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddProjectDetail;
