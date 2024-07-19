import React, { useEffect, useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [totalProjectDetails, setTotalProjectDetails] = useState(0); // Add state for total project details
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    media: {
      file: null,
      iframe: "",
      filepath: "",
    },
    sequence: "", // Add sequence field
  });

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/project_detail/${id}`);
        const projectDetailData = response.data.projectDetail;

        setProjectDetail(projectDetailData);
        setSelectedProjectName(projectDetailData.project_name);

        setFormData({
          project_name: projectDetailData.project_name,
          media: {
            file: null,
            iframe: projectDetailData.media.iframe || "",
            filepath: projectDetailData.media.filepath || "",
          },
          sequence: projectDetailData.sequence || "", // Set initial sequence value
        });

        // Fetch total project details count for selected project name
        const totalDetailsResponse = await axios.get(
          `${apiUrl}/api/project_detail/count/${projectDetailData.project_name}`
        );
        setTotalProjectDetails(totalDetailsResponse.data.count);
      } catch (error) {
        console.error("Error fetching project detail:", error);
      }
    };

    fetchProjectDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
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

  const fetchProjectNames = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/project/projectname`);
      // setProjectNames(response.data.projectNames);
      const sortedProjectNames = response.data.projectNames.sort((a, b) =>
        a.localeCompare(b)
      );
      console.log(sortedProjectNames);
      setProjectNames(sortedProjectNames);
    } catch (error) {
      console.error("Error fetching project names:", error);
    }
  };

  useEffect(() => {
    fetchProjectNames();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("project_name", selectedProjectName);

  //     if (formData.media.file) {
  //       formDataToSend.append("media", formData.media.file);
  //     } else if (formData.media.iframe.trim()) {
  //       formDataToSend.append("media", formData.media.iframe.trim());
  //     }

  //     formDataToSend.append("sequence", formData.sequence); // Add sequence to form data

  //     const access_token = localStorage.getItem("access_token");

  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/api/project_detail/${id}`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     console.log(
  //       "Updated Project Detail: ",
  //       response.data.updatedProjectDetail
  //     );
  //     navigate("/admin/project_detail");
  //   } catch (error) {
  //     console.error("Error updating project detail:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sequence > totalProjectDetails) {
      setErrorMessage(
        `Total entries are ${totalProjectDetails}. Sequence number cannot be greater than ${totalProjectDetails}`
      );
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("project_name", selectedProjectName); // Use selectedProjectName which is the _id

      if (formData.media.file) {
        formDataToSend.append("media", formData.media.file);
      } else if (formData.media.iframe.trim()) {
        formDataToSend.append("media", formData.media.iframe.trim());
      }

      formDataToSend.append("sequence", formData.sequence); // Add sequence to form data

      const access_token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/project_detail/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(
        "Updated Project Detail: ",
        response.data.updatedProjectDetail
      );
      navigate("/admin/project_detail");
    } catch (error) {
      console.error("Error updating project detail:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Project Detail</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Project Name</label>
                <select
                  value={selectedProjectName}
                  onChange={(e) => {
                    setSelectedProjectName(e.target.value);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      project_name: e.target.value,
                    }));
                  }}
                >
                  {projectNames.map((name) => (
                    <option key={name._id} value={name._id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Sequence</label>
                <input
                  type="text"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
                <div className="col-12">
                  <div className="theme-form">
                    <span className="text-danger">{errorMessage}</span>
                  </div>
                </div>
              )}
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
                  accept=".webp"
                  onChange={handleChange}
                />

                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={`${process.env.REACT_APP_API_URL}/${formData.media.filepath}`}
                    alt={`${formData.media.filename}`}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="error-message text-danger mt-2">
                {errorMessage}
              </div>
            )}

            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
              <button type="submit" className="btn btn-primary">
                Update Project Detail
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProjectDetail;
