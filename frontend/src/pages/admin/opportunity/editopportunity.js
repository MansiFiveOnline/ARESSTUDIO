import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditOpportunity = () => {
  const { id } = useParams(); // Assuming the parameter is named userId
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibility: "",
    qualification: "",
  });

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: `opportunity/${id}/`,
        });

        const { title, description, responsibility, qualification } =
          response.data.opportunity;

        setFormData({
          title,
          description,
          responsibility,
          qualification,
        });
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "PATCH",
        baseURL: `${apiUrl}/api/`,
        url: `opportunity/${id}`,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("Opportunity updated:", response.data.updatedOpportunity);

      // setTimeout(() => {
      //   navigate("/admin/opportunities");
      // }, 1000);
      navigate("/admin/opportunities");
    } catch (error) {
      console.error("Error updating opportunity:", error);
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Opportunity</h2>
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
                <label>Description</label>
                <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Responsibility</label>
                <textarea
                  type="text"
                  name="responsibility"
                  value={formData.responsibility}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Qualification</label>
                <textarea
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  rows={4}
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

export default EditOpportunity;
