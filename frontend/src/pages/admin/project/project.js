import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const response = await axios.get("/api/user/allUsers");
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "project",
        });
        console.log(response.data.projects);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching users:", error);
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
      setProjects(null); // Update user state to null after deletion

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
            <i class="las la-plus-circle"></i>
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
                  {projects &&
                    projects.map((project) => (
                      <tr key={project._id}>
                        <td>{project.project_name}</td>
                        <td className="text-center">{project.service_name}</td>
                        <td className="text-center">{project.gallery_name}</td>
                        <td className="text-center">
                          {project.isPublic === true ? (
                            <span>Public</span>
                          ) : (
                            <span>Private</span>
                          )}
                        </td>

                        <td className="table-profile-img text-center">
                          {project.type === "image" ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${project.media.filepath}`} // Assuming filepath contains the path to the image
                              alt={`${project.media.filename}`}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <span>{project.media.iframe}</span>
                          )}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/edit/project/${project._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(project._id)}
                          >
                            <i class="las la-trash"></i>{" "}
                          </button>
                        </td>
                      </tr>
                    ))}
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
