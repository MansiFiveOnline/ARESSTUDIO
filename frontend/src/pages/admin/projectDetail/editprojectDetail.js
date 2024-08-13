import React, { useEffect, useState } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const EditProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [totalProjectDetails, setTotalProjectDetails] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPosterImgRequired, setIsPosterImgRequired] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    media: {
      file: null,
      iframe: "",
      filepath: "",
    },
    posterImg: {
      file: null,
      filepath: "",
    },
    sequence: "",
    description: "",
  });

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/project/projectname`);
        const sortedProjectNames = response.data.projectNames.sort((a, b) =>
          a.localeCompare(b)
        );
        setProjectNames(sortedProjectNames);
      } catch (error) {
        console.error("Error fetching project names:", error);
      }
    };

    fetchProjectNames();
  }, []);

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
            filepath: projectDetailData.media.filepath
              ? `${apiUrl}/${projectDetailData.media.filepath}`
              : "",
          },
          posterImg: {
            file: null,
            filepath: projectDetailData.posterImg
              ? `${apiUrl}/${projectDetailData.posterImg.filepath}`
              : "",
          },
          sequence: projectDetailData.sequence || "",
          description: projectDetailData.description || "",
        });

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
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            file: files[0],
            iframe: "",
            filepath: URL.createObjectURL(files[0]),
          },
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(false);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            ...prevFormData.media,
            iframe: value.trim(),
            filepath: "",
          },
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
        setIsPosterImgRequired(true);
      }
    } else if (name === "posterImg") {
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posterImg: {
            file: files[0],
            filepath: URL.createObjectURL(files[0]),
          },
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posterImg: {
            file: null,
            filepath: "",
          },
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.trim() === "" ? "" : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sequence > totalProjectDetails) {
      setErrorMessage(
        `Total entries are ${totalProjectDetails}. Sequence number cannot be greater than ${totalProjectDetails}`
      );
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("project_name", selectedProjectName);
    formDataToSend.append("sequence", formData.sequence);
    formDataToSend.append("description", formData.description || "");

    if (formData.media.file) {
      formDataToSend.append("media", formData.media.file);
      formDataToSend.append("type", "image");
    } else if (formData.media.iframe) {
      formDataToSend.append("media", formData.media.iframe);
      formDataToSend.append("type", "video");
    } else {
      formDataToSend.append("type", "none");
    }

    if (formData.posterImg.file) {
      formDataToSend.append("posterImg", formData.posterImg.file);
    }

    const access_token = localStorage.getItem("access_token");

    try {
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
        "Updated Project Detail:",
        response.data.updatedProjectDetail
      );
      navigate("/admin/project_detail");
    } catch (error) {
      console.error("Error updating project detail:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred");
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
                    const newProjectName = e.target.value;
                    setSelectedProjectName(newProjectName);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      project_name: newProjectName,
                    }));
                  }}
                >
                  {projectNames.map((name) => (
                    <option key={name} value={name}>
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
                <label>Media (1920 X 1000)</label>
                <input
                  type="text"
                  name="media"
                  value={formData.media.iframe}
                  placeholder="iFrame URL"
                  onChange={handleChange}
                />
                <span> OR </span>
                <input type="file" name="media" onChange={handleChange} />
                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={formData.media.filepath}
                    alt="Media"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {formData.media.iframe && (
              <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="theme-form">
                  <label>Poster Image</label>
                  <input type="file" name="posterImg" onChange={handleChange} />
                  {formData.posterImg.filepath && (
                    <img
                      className="form-profile"
                      src={formData.posterImg.filepath}
                      alt="Poster"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="col-12">
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
