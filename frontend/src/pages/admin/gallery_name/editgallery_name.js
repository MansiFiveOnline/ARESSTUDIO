import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditGalleryName = () => {
  const { id } = useParams(); // Assuming the parameter is named userId
  const [formData, setFormData] = useState({
    service_name: "",
    gallery_name: "",
  });
  const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryName = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: `gallery_name/${id}`,
        });

        const { service_name, gallery_name } = response.data.galleryName;
        setFormData({
          service_name,
          gallery_name,
        });
        setSelectedService(service_name);
      } catch (error) {
        console.error("Error fetching gallery name:", error);
      }
    };

    fetchGalleryName();
  }, [id]); // Ensure this runs once when `id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "PATCH",
        baseURL: `${apiUrl}/api/`,
        url: `gallery_name/${id}`,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      setFormData(response.data.updatedGalleryName);
      console.log("Gallery name updated:", response.data.updatedGalleryName);
      // setTimeout(() => {
      //   navigate("/admin/gallery_name");
      // }, 2000);

      navigate("/admin/gallery_name");
    } catch (error) {
      console.error("Error updating gallery name:", error);
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Service Gallery Name</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Service Name</label>
                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      service_name: e.target.value,
                    }));
                  }}
                >
                  <option value="GAMES">GAMES</option>
                  <option value="VFX">VFX</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Gallery Name</label>
                <input
                  type="text"
                  name="gallery_name"
                  value={formData.gallery_name}
                  onChange={handleChange}
                />
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

export default EditGalleryName;
