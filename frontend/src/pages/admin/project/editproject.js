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
  const [serviceChanged, setServiceChanged] = useState(false); // Track if service name has been changed
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    service_name: "",
    gallery_name: "",
    media: {
      file: null,
      iframe: "",
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
            filepath: projectData.media.filepath || "",
          },
        });

        fetchGalleryNames(projectData.service_name);
        console.log("project detail", projectData);
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
        setFormData({
          ...formData,
          media: {
            file: files[0],
            filename: files[0].name,
            filepath: URL.createObjectURL(files[0]),
            iframe: "",
          },
        });
      } else {
        setFormData({
          ...formData,
          media: {
            ...formData.media,
            iframe: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value.trim() === "" ? "" : value,
      });
    }
  };

  const fetchGalleryNames = async (service_name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(
        `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
      );

      console.log("gallery name", response);

      setGalleryNames(response.data.galleryNames);
      // setSelectedGallery(""); // Reset selected gallery when service changes
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
    setServiceChanged(true); // Mark that the service name has been changed
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = new FormData();

  //     // Append all form data
  //     formDataToSend.append("project_name", formData.project_name);
  //     formDataToSend.append("subtitle", formData.subtitle);
  //     formDataToSend.append("description", formData.description);
  //     formDataToSend.append("service_name", selectedService);
  //     formDataToSend.append("gallery_name", selectedGallery);
  //     formDataToSend.append("isPublic", isPublic);

  //     if (formData.media.file) {
  //       formDataToSend.append("media", formData.media.file);
  //     } else if (formData.media.iframe.trim()) {
  //       formDataToSend.append("media", formData.media.iframe.trim());
  //     }

  //     const access_token = localStorage.getItem("access_token");
  //     const apiUrl = process.env.REACT_APP_API_URL;

  //     const response = await axios.patch(
  //       `${apiUrl}/api/project/${id}`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     console.log("Updated project", response.data.updatedProject);

  //     navigate("/admin/project");
  //   } catch (error) {
  //     console.error("Error updating project:", error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = {
  //       project_name: formData.project_name,
  //       subtitle: formData.subtitle.trim() === "" ? "" : formData.subtitle,
  //       description:
  //         formData.description.trim() === "" ? "" : formData.description,
  //       service_name: selectedService,
  //       gallery_name: selectedGallery,
  //       isPublic: isPublic,
  //     };

  //     if (formData.media.file) {
  //       formDataToSend.media = formData.media.file;
  //     } else if (formData.media.iframe.trim()) {
  //       formDataToSend.media = formData.media.iframe.trim();
  //     }

  //     const access_token = localStorage.getItem("access_token");
  //     const apiUrl = process.env.REACT_APP_API_URL;

  //     const response = await axios.patch(
  //       `${apiUrl}/api/project/${id}`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     console.log("Updated project", response.data.updatedProject);

  //     navigate("/admin/project");
  //   } catch (error) {
  //     console.error("Error updating project:", error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = {
  //       project_name: formData.project_name.trim(),
  //       subtitle: formData.subtitle.trim(),
  //       description: formData.description.trim(),
  //       service_name: selectedService,
  //       gallery_name: selectedGallery,
  //       isPublic: isPublic,
  //     };

  //     if (formData.media.file) {
  //       formDataToSend.media = formData.media.file;
  //     } else if (formData.media.iframe.trim()) {
  //       formDataToSend.media = formData.media.iframe.trim();
  //     }

  //     const access_token = localStorage.getItem("access_token");
  //     const apiUrl = process.env.REACT_APP_API_URL;

  //     const response = await axios.patch(
  //       `${apiUrl}/api/project/${id}`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     console.log("Updated project", response.data.updatedProject);

  //     // Update project list state here if needed

  //     navigate("/admin/project");
  //   } catch (error) {
  //     console.error("Error updating project:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("project_name", formData.project_name.trim());
    formDataToSend.append("subtitle", formData.subtitle.trim());
    formDataToSend.append("description", formData.description.trim());
    formDataToSend.append("service_name", selectedService);
    formDataToSend.append("gallery_name", selectedGallery);
    formDataToSend.append("isPublic", isPublic);

    if (formData.media.file) {
      formDataToSend.append("media", formData.media.file);
    } else {
      formDataToSend.append("media", formData.media.iframe.trim());
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
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
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
                  // value={formData.description}
                  // onChange={handleChange}
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
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
                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={`${process.env.REACT_APP_API_URL}/${formData.media.filepath}`}
                    alt={`${formData.media.filename}`}
                    loading="lazy"
                  />
                )}
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

export default EditProject;
