import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [galleryNames, setGalleryNames] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedGallery, setSelectedGallery] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [serviceChanged, setServiceChanged] = useState(false);
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPosterImgRequired, setIsPosterImgRequired] = useState(false);

  const [formData, setFormData] = useState({
    service_name: "",
    gallery_name: "",
    media: {
      file: null,
      iframe: "",
      filepath: "",
    },
    posterImg: {
      file: null,
      filepath: "",
    },
    project_name: "",
    subtitle: "",
    description: "",
    isPublic: true,
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/project/${id}`);
        const projectData = response.data.project;

        setProject(projectData);
        setSelectedService(projectData.service_name);
        setSelectedGallery(projectData.gallery_name);

        setFormData({
          service_name: projectData.service_name,
          gallery_name: projectData.gallery_name,
          project_name: projectData.project_name,
          subtitle: projectData.subtitle || "",
          description: projectData.description || "",
          isPublic: projectData.isPublic,
          media: {
            file: null,
            iframe: projectData.media.iframe || "",
            filepath: projectData.media.filepath
              ? `${apiUrl}/${projectData.media.filepath}`
              : "",
          },
          posterImg: {
            file: null,
            filepath: projectData.posterImg
              ? `${apiUrl}/${projectData.posterImg.filepath}`
              : "",
          },
        });

        setIsPublic(projectData.isPublic);
        fetchGalleryNames(projectData.service_name);
        setIsPosterImgRequired(projectData.type === "video");
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            file: files[0],
            iframe: "",
            filepath: URL.createObjectURL(files[0]),
          },
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(false);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            ...prevFormData.media,
            file: null,
            iframe: value.trim(),
            filepath: "",
          },
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(true);
      }
    } else if (name === "posterImg") {
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posterImg: {
            file: files[0],
            filepath: URL.createObjectURL(files[0]),
          },
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.trim() === "" ? "" : value,
      }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  const fetchGalleryNames = async (service_name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(
        `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
      );
      setGalleryNames(response.data.galleryNames);
    } catch (error) {
      console.error("Error fetching gallery names:", error);
    }
  };

  useEffect(() => {
    if (serviceChanged) {
      fetchGalleryNames(selectedService);
    }
  }, [selectedService, serviceChanged]);

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setServiceChanged(true);
    setFormData((prevFormData) => ({
      ...prevFormData,
      service_name: e.target.value,
    }));
  };

  const handleGalleryChange = (e) => {
    setSelectedGallery(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      gallery_name: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage("");

    // Validate if posterImg is required
    if (formData.media.iframe && !formData.posterImg.file) {
      setErrorMessage("Poster Image is required when using an iframe URL.");
      return; // Prevent form submission
    }

    const formDataToSend = new FormData();

    formDataToSend.append("project_name", formData.project_name);
    formDataToSend.append("subtitle", formData.subtitle || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("service_name", formData.service_name);
    formDataToSend.append("gallery_name", formData.gallery_name);
    formDataToSend.append("isPublic", formData.isPublic);

    if (formData.media.file) {
      formDataToSend.append("media", formData.media.file);
      formDataToSend.append("type", "image");
    } else if (formData.media.iframe) {
      formDataToSend.append("media", formData.media.iframe);
      formDataToSend.append("type", "video");
    }

    if (formData.posterImg.file) {
      formDataToSend.append("posterImg", formData.posterImg.file);
    } else if (formData.posterImg.filepath) {
      formDataToSend.append("posterImg", formData.posterImg.filepath);
    }

    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.patch(
        `${apiUrl}/api/project/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Updated project", response.data.updatedProject);
      navigate("/admin/project");
    } catch (error) {
      console.error("Error updating project:", error);
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
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Project</h2>
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
                  value={formData.project_name}
                  onChange={handleChange}
                  // value={formData.project_name}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, project_name: value })
                  // }
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                {/* <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  // value={formData.description}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, description: value })
                  // }
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Service</label>
                <select value={selectedService} onChange={handleServiceChange}>
                  <option value="">Select Service</option>
                  <option value="GAMES">GAMES</option>
                  <option value="VFX">VFX</option>
                </select>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Gallery Name</label>
                <select
                  value={selectedGallery}
                  onChange={(e) => {
                    setSelectedGallery(e.target.value);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      gallery_name: e.target.value,
                    }));
                  }}
                >
                  {serviceChanged && <option value="">Select Gallery</option>}
                  {galleryNames.map((gallery) => (
                    <option key={gallery._id} value={gallery._id}>
                      {gallery}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Gallery Name</label>
                <select value={selectedGallery} onChange={handleGalleryChange}>
                  {serviceChanged && <option value="">Select Gallery</option>}
                  {galleryNames.map((gallery) => (
                    <option key={gallery._id} value={gallery.gallery_name}>
                      {gallery}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="py-3">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic} // Controlled by isPublic state
                  onChange={(e) => setIsPublic(e.target.checked)} // Update isPublic state directly
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
                  value={formData.media.iframe}
                  placeholder="iFrame URL"
                  onChange={handleChange}
                />
                <span> OR </span>
                <input
                  type="file"
                  name="media"
                  accept=".webp"
                  onChange={handleChange}
                />
                {formData.media?.filepath && (
                  <img
                    className="form-profile"
                    src={`${formData.media.filepath}`}
                    alt={`${formData.media.filename}`}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {isPosterImgRequired && (
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="theme-form">
                  <label>Poster Image (for iPhone)</label>
                  <input
                    type="file"
                    name="posterImg"
                    accept=".webp"
                    onChange={handleChange}
                  />
                  {formData.posterImg.filepath && (
                    <img
                      className="form-profile"
                      src={`${formData.posterImg.filepath}`}
                      alt={formData.posterImg.filename || "Poster Image"}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            )}

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

export default EditProject;
