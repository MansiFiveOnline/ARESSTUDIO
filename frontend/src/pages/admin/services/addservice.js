import React, { useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddService = () => {
  const [service_name, setServiceName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState({ iframe: "", file: null });
  const navigate = useNavigate();
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [validationError, setValidationError] = useState(""); // State for validation error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!media.iframe && !media.file) {
      setValidationError("Please provide either an iFrame URL or an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("service_name", service_name);
      formData.append("title", title);
      formData.append("subtitle", subtitle || "");
      formData.append("description", description || "");
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);

      // Check if both media fields are provided
      if (media.iframe && media.file) {
        throw new Error(
          "Please provide either an iFrame URL or an image, not both."
        );
      }

      // Check if the media field is empty
      if (!media.iframe && !media.file) {
        throw new Error(
          "Either a file or a valid URL is required for the media field."
        );
      }

      // Append media based on the provided type
      if (media.iframe) {
        formData.append("media", media.iframe);
      } else if (media.file) {
        formData.append("media", media.file);
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
      // setTimeout(() => {
      //   navigate("/admin/services");
      // }, 2000);

      navigate("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
    }
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
                <textarea
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
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
