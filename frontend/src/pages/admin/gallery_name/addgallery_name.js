import React, { useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddGalleryName = () => {
  const [service_name, setServiceName] = useState("");
  const [gallery_name, setGalleryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Service:", service_name);
    try {
      const formData = {
        service_name,
        gallery_name,
      };

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios({
        method: "POST",
        baseURL: `${apiUrl}/api/`,
        url: "gallery_name",
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data.newGalleryName);
      // setTimeout(() => {
      //   navigate("/admin/gallery_name");
      // }, 2000);

      navigate("/admin/gallery_name");
    } catch (error) {
      console.error("Error creating gallery name:", error);
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Add Service Gallery Name</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Service Name</label>
                <select
                  value={service_name}
                  required
                  onChange={(e) => setServiceName(e.target.value)}
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
                <input
                  type="text"
                  required
                  name="gallery_name"
                  value={gallery_name}
                  onChange={(e) => setGalleryName(e.target.value)}
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

export default AddGalleryName;
