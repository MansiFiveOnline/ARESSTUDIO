import React, { useState } from "react";
import Layout from "../../../components/adminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTeam = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [linkedin_url, setLinkedinURL] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to store the form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("linkedin_url", linkedin_url);
      formData.append("image", image);

      const access_token = localStorage.getItem("access_token");

      // Make a POST request to the backend to create a new team

      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios({
        method: "POST",
        baseURL: `${apiUrl}/api/`,
        url: "team",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });
      // const response = await axios.post("/api/team/createteam", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      console.log(response.data);
      // setTimeout(() => {
      navigate("/admin/team");
      // }, 2000);
    } catch (error) {
      console.error("Error creating team:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Add Members</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin_url"
                  value={linkedin_url}
                  onChange={(e) => setLinkedinURL(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Image (500 X 750)</label>
                <input
                  type="file"
                  name="image"
                  accept=".webp"
                  // value={image}
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
                {/* <img className="form-profile" src="src/img/team-icon-img.png" /> */}
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

export default AddTeam;
