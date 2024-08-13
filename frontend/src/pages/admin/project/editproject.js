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
  const [errorMessage, setErrorMessage] = useState("");

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
          project_name: projectData.project_name || "",
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
            filepath: projectData.posterImg?.filepath
              ? `${apiUrl}/${projectData.posterImg.filepath}`
              : "",
          },
        });

        setIsPublic(projectData.isPublic);
        fetchGalleryNames(projectData.service_name);
      } catch (error) {
        console.error("Error fetching project:", error);
        setErrorMessage("Failed to fetch project data.");
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (serviceChanged) {
      fetchGalleryNames(selectedService);
    }
  }, [selectedService, serviceChanged]);

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
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            ...prevFormData.media,
            iframe: value.trim(),
            filepath: "",
          },
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
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
    setErrorMessage("");

    // Validate form data
    const isMediaIframe = formData.media.iframe.trim() !== "";
    const isPosterImgRequired = isMediaIframe && !formData.posterImg.file;

    // if (isPosterImgRequired) {
    //   setErrorMessage("Poster Image is required when using an iframe URL.");
    //   return;
    // }

    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append("project_name", formData.project_name);
    formDataToSend.append("subtitle", formData.subtitle || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("service_name", formData.service_name);
    formDataToSend.append("gallery_name", formData.gallery_name);
    formDataToSend.append("isPublic", formData.isPublic);

    // Handle media type and file
    if (formData.media.file) {
      formDataToSend.append("media", formData.media.file);
      formDataToSend.append("type", "image");
    } else if (formData.media.iframe) {
      formDataToSend.append("media", formData.media.iframe);
      formDataToSend.append("type", "video");
    }

    // Handle poster image
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

      console.log("Updated project:", response.data.updatedProject);
      navigate("/admin/project");
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred");
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
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  formats={formats}
                  modules={modules}
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
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Media</label>
                <input
                  type="text"
                  name="media"
                  value={formData.media.iframe}
                  placeholder="iFrame URL"
                  onChange={handleChange}
                />
                <span>OR</span>
                <input type="file" name="media" onChange={handleChange} />
                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={`${formData.media.filepath}`}
                    alt={`${formData.media.filename}`}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
            {formData.media.iframe && (
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="theme-form">
                  <label>Poster Image</label>
                  <input type="file" name="posterImg" onChange={handleChange} />
                </div>
                {formData.posterImg.filepath && (
                  <img
                    className="form-profile mb-4"
                    src={`${formData.posterImg.filepath}`}
                    alt={`${formData.posterImg.filename}`}
                    loading="lazy"
                  />
                )}
              </div>
            )}

            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </div>

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
