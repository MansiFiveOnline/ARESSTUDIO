import React, { useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddService = () => {
  const [service_name, setServiceName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState({ iframe: "", file: null });
  const [posterImg, setPosterImg] = useState(null);
  const navigate = useNavigate();
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [validationError, setValidationError] = useState(""); // State for validation error message
  const [errorMessage, setErrorMessage] = useState("");

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
      formData.append("service_name", service_name);
      formData.append("title", title);
      formData.append("subtitle", subtitle || "");
      formData.append("description", description || "");
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);

      if (media.iframe) {
        formData.append("media", media.iframe);
      } else if (media.file) {
        formData.append("media", media.file);
      }

      if (posterImg) {
        formData.append("posterImg", posterImg);
      }

      // Log formData content for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "POST",
        baseURL: `${apiUrl}/api`,
        url: `service`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data.newService);
      navigate("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
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
        <h2>Add Service</h2>
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
                  required
                  value={service_name}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                {/* <img className="form-profile" src="src/img/user-icon-img.png" /> */}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                {/* <textarea
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="description"
                  value={description}
                />
                {/* <img className="form-profile" src="src/img/user-icon-img.png" /> */}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                {/* Display a message if media field has a value before submitting */}

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
                      // filename: e.target.files[0],
                      // filepath: e.target.files[0],
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

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Description</label>
                <textarea
                  type="text"
                  name="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={4}
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
                {/* <input type="button" value="Save" onClick={handleSubmit}/> */}
                <button type="submit">Save</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddService;
