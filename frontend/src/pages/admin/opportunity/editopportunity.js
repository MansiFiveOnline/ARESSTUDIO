import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditOpportunity = () => {
  const { id } = useParams(); // Assuming the parameter is named userId
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleDescriptionChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  const handleResponsibiltyChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      responsibility: value,
    }));
  };

  const handleQualification = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qualification: value,
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
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
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
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  // value={formData.description}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, description: value })
                  // }
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Responsibility</label>
                {/* <textarea
                  type="text"
                  name="responsibility"
                  value={formData.responsibility}
                  onChange={handleChange}
                  rows={4}
                /> */}

                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="responsibility"
                  value={formData.responsibility}
                  onChange={handleResponsibiltyChange}
                  // value={formData.description}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, description: value })
                  // }
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Qualification</label>
                {/* <textarea
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  rows={4}
                /> */}
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleQualification}
                  // value={formData.description}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, description: value })
                  // }
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

export default EditOpportunity;
