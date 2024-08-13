import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddProject = () => {
  const [service_name, setServiceName] = useState("");
  const [project_name, setProjectName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedGallery, setSelectedGallery] = useState("");
  const [galleryNames, setGalleryNames] = useState([]);
  const [media, setMedia] = useState({ iframe: "", file: null });
  const [isPublic, setIsPublic] = useState(true);
  const [validationError, setValidationError] = useState(""); // State for validation error message
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [posterImg, setPosterImg] = useState(null);

  const fetchGalleryNames = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios({
        method: "GET",
        baseURL: `${apiUrl}/api/`,
        url: `gallery_name/gallerynames?service_name=${selectedService}`,
      });

      setGalleryNames(response.data.galleryNames);
    } catch (error) {
      console.error("Error fetching gallery names:", error);
    }
  };

  useEffect(() => {
    if (selectedService) {
      fetchGalleryNames();
    }
  }, [selectedService]);

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
      setServiceName(selectedService);

      const formData = new FormData();
      formData.append("project_name", project_name);
      formData.append("subtitle", subtitle || "");
      formData.append("description", description || "");
      formData.append("gallery_name", selectedGallery);
      formData.append("service_name", selectedService);
      formData.append("isPublic", isPublic);

      if (media.iframe) {
        formData.append("media", media.iframe);
      } else if (media.file) {
        formData.append("mediaFile", media.file);
      }

      if (posterImg) {
        formData.append("posterImg", posterImg);
      }

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.post(`${apiUrl}/api/project`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data.newProject);
      navigate("/admin/project");
    } catch (error) {
      console.error("Error creating project:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "list",
    "bullet",
    "indent",
  ];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Add Project</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Project Name</label>
                <input
                  type="text"
                  name="project_name"
                  required
                  value={project_name}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                {/* <ReactQuill
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                /> */}
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="description"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Service</label>
                <select
                  value={selectedService}
                  required
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    fetchGalleryNames();
                  }}
                >
                  <option value="">Select a service</option>
                  <option value="GAMES">GAMES</option>
                  <option value="VFX">VFX</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Gallery Name</label>
                <select
                  value={selectedGallery}
                  required
                  onChange={(e) => setSelectedGallery(e.target.value)}
                >
                  <option value="">Select a Gallery</option>
                  {galleryNames.map((gallery_name) => (
                    <option key={gallery_name._id} value={gallery_name}>
                      {gallery_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="py-3">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Public
              </label>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Media (1920 X 1080)</label>
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
                  name="media"
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

export default AddProject;
