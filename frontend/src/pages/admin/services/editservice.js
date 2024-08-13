import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPosterImgRequired, setIsPosterImgRequired] = useState(false);
  const [isPosterImgDisabled, setIsPosterImgDisabled] = useState(true);

  const [formData, setFormData] = useState({
    service_name: "",
    url: "",
    title: "",
    subtitle: "",
    description: "",
    media: {
      file: null,
      iframe: "",
      filepath: "",
    },
    posterImg: {
      file: null,
      filepath: "",
    },
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/service/${id}`);
        const serviceData = response.data.service;
        setService(serviceData);
        setFormData({
          service_name: serviceData.service_name || "",
          url: serviceData.url || "",
          title: serviceData.title || "",
          subtitle: serviceData.subtitle || "",
          description: serviceData.description || "",
          media: {
            file: null,
            iframe: serviceData.media.iframe || "",
            filepath: serviceData.media.filepath
              ? `${apiUrl}/${serviceData.media.filepath}`
              : "",
          },
          posterImg: {
            file: null,
            filepath: serviceData.posterImg?.filepath
              ? `${apiUrl}/${serviceData.posterImg.filepath}`
              : "",
          },
          metaTitle: serviceData.metaTitle || "",
          metaDescription: serviceData.metaDescription || "",
        });

        // Determine if posterImg should be required and disabled
        // const isIframe = serviceData.media.iframe.trim() !== "";
        // setIsPosterImgRequired(serviceData.type === "video");
        setIsPosterImgDisabled(serviceData.media.iframe.trim() === "");
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
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
            // Reset poster image when media changes
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(false); // Poster image is not required
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
            // Reset poster image when media changes
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(true); // Poster image is required
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData instance
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "media" || key === "posterImg") {
        if (formData[key].file) {
          formDataToSend.append(key, formData[key].file);
        } else if (formData[key].iframe) {
          formDataToSend.append(key, formData[key].iframe);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add type to form data
    formDataToSend.append(
      "type",
      formData.media.iframe.trim() !== "" ? "video" : "image"
    );

    // Send the request
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.patch(
        `${apiUrl}/api/service/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Updated service", response.data.updatedService);
      navigate("/admin/services");
    } catch (error) {
      console.error("Error updating service:", error);
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
        <h2>Edit Service</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Name</label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>URL</label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  value={formData.subtitle || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Media (1920 X 1080)</label>
                <input
                  type="text"
                  name="media"
                  value={formData.media.iframe || ""}
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
                    src={formData.media.filepath}
                    alt="Media"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {formData.media.iframe && (
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
                      src={formData.posterImg.filepath}
                      alt="Poster"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Description</label>
                <input
                  type="text"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
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

export default EditService;
