import React, { useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddOpportunity = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [qualification, setQualification] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        title,
        description,
        responsibility,
        qualification,
      };

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "POST",
        baseURL: `${apiUrl}/api/`,
        url: `opportunity`,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data.newOpportunity);
      // setTimeout(() => {
      //   navigate("/admin/opportunities");
      // }, 2000);
      navigate("/admin/opportunities");
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Add Opportunity</h2>
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
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                <textarea
                  type="text"
                  name="description"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
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
                  required
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
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
                  value={qualification}
                  required
                  onChange={(e) => setQualification(e.target.value)}
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

export default AddOpportunity;
