import React, { useEffect, useState } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "project",
        });

        console.log(response.data.projects);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `project/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(response.data);
      setProjects(projects.filter((project) => project._id !== id));
      setTimeout(() => {
        navigate("/admin/project");
      }, 2000);
    } catch (error) {
      console.error("Error deleting Project:", error);
    }
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Project
          <NavLink to="/admin/add/project" className="theme-cta">
            <i className="las la-plus-circle"></i>
            Add Project
          </NavLink>
        </h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              <table id="example" className="table nowrap">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th className="text-center">Service</th>
                    <th className="text-center">Gallery Name</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Media</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project._id}>
                        <td>{project.project_name}</td>
                        <td className="text-center">{project.service_name}</td>
                        <td className="text-center">
                          {project.gallery_name || "N/A"}
                        </td>
                        <td className="text-center">
                          {project.isPublic ? (
                            <span>Public</span>
                          ) : (
                            <span>Private</span>
                          )}
                        </td>

                        <td className="table-profile-img text-center">
                          {project.media && project.media.filepath ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${project.media.filepath}`}
                              alt={project.media.filename || "Media"}
                              loading="lazy"
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : project.media && project.media.iframe ? (
                            <span>{project.media.iframe}</span>
                          ) : (
                            <span>No media available</span>
                          )}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/edit/project/${project._id}`}
                            title="Edit"
                          >
                            <i className="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(project._id)}
                          >
                            <i className="las la-trash"></i>{" "}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project;
