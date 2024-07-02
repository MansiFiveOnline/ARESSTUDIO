import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditCareer = () => {
  // const { id } = useParams();
  // const [career, setCareer] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    // media: {
    //   file: null,
    //   iframe: "",
    //   filepath: "",
    // },
    media: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(`${apiUrl}/api/career`);

        const careerData = response.data.careers[0];

        // setCareer(careerData);
        setFormData({
          title: careerData.title,
          subtitle: careerData.subtitle,

          media: careerData.media,
          metaTitle: careerData.metaTitle,
          metaDescription: careerData.metaDescription,
        });
      } catch (error) {
        console.error("Error fetching career:", error);
      }
    };

    fetchCareer();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // if (name === "media") {
    //   if (files && files.length > 0) {
    //     setFormData({
    //       ...formData,
    //       media: {
    //         file: files[0],
    //         filename: files[0].name,
    //         filepath: URL.createObjectURL(files[0]),
    //         iframe: "",
    //       },
    //     });
    //   } else {
    //     setFormData({
    //       ...formData,
    //       media: {
    //         ...formData.media,
    //         iframe: value,
    //       },
    //     });
    //   }
    // } else {
    //   setFormData({
    //     ...formData,
    //     [name]: value,
    //   });
    // }

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
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaDescription", formData.metaDescription);

      // if (formData.media.file) {
      //   formDataToSend.append("media", formData.media.file);
      // } else if (formData.media.iframe.trim()) {
      //   formDataToSend.append("media", formData.media.iframe.trim());
      // }

      if (formData.media.file || formData.media.iframe) {
        if (formData.media.file) {
          formDataToSend.append("media", formData.media.file);
        } else {
          formDataToSend.append("media", formData.media.iframe);
        }
      }

      const access_token = localStorage.getItem("access_token");

      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.patch(
        `${apiUrl}/api/career`,
        // {
        formDataToSend,
        // },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Career updated:", response.data.updatedCareer);
      // setTimeout(() => {
      //   navigate("/admin/edit/career");
      // }, 2000);

      navigate("/admin/edit/career");
    } catch (error) {
      console.error("Error updating career:", error);
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Career</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
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
                  value={formData.subtitle}
                  onChange={handleChange}
                />
              </div>
            </div>

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
                <textarea
                  type="text"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
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
                  onChange={handleChange}
                  accept=".webp"
                />

                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={`${process.env.REACT_APP_API_URL}/${formData.media.filepath}`}
                    alt={`${formData.media.filename}`}
                  />
                )}
              </div>
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

export default EditCareer;
