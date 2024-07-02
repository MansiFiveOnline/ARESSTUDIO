import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminServices = () => {
  const [services, setServices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // const response = await axios.get("/api/user/allservices");
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "service",
        });
        console.log(response.data.services);
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      // await axios.delete(`http://localhost:8000/api/user/${id}`);
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `service/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setServices(null); // Update user state to null after deletion

      console.log(response.data);
      setServices(services.filter((service) => service._id !== id));
      setTimeout(() => {
        navigate("/admin/services");
      }, 2000);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // useEffect(() => {
  //   // Set document title and meta description
  //   const service = services[0]; // Assuming you want to use the meta information from the first service
  //   if (service) {
  //     document.title = service.metaTitle;
  //     const metaDescriptionTag = document.querySelector(
  //       'meta[name="description"]'
  //     );
  //     if (metaDescriptionTag) {
  //       metaDescriptionTag.setAttribute("content", service.metaDescription);
  //     } else {
  //       const newMetaTag = document.createElement("meta");
  //       newMetaTag.setAttribute("name", "description");
  //       newMetaTag.setAttribute("content", service.metaDescription);
  //       document.head.appendChild(newMetaTag);
  //     }
  //   }
  // }, [services]);

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Services
          <NavLink to="/admin/add/service" className="theme-cta">
            <i class="las la-plus-circle"></i>
            Add Service
          </NavLink>
        </h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              {/* <DataTable
          value={services}
          paginator
          sortMode="multiple"
          rows={1}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            field="name"
            header="Name"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="designation"
            header="Designation"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="linkedin_url"
            header="LinkedIn URL"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="services.imageUrl"
            header="Image"
            sortable
            style={{ width: "25%" }}
          >
            {" "}
            <img
              src=""
              alt="new"
              style={{ width: "50px", height: "50px" }}
              header="Image"
            />
          </Column> */}

              <table id="example" className="table nowrap">
                <thead>
                  <tr>
                    <th>Name</th>
                    {/* <th>URL</th> */}
                    {/* <th>Title</th> */}
                    {/* <th className="text-center">Subtitle</th>
                    <th className="text-center">Description</th> */}
                    <th className="text-center">Media</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {services &&
                    services.map((service) => (
                      <tr key={service._id}>
                        <td>{service.service_name}</td>
                        {/* <td>{service.url}</td>
                        <td>{service.title}</td>
                        <td className="text-center">{service.subtitle}</td>
                        <td className="text-center">{service.description}</td> */}
                        <td className="table-profile-img text-center">
                          {service.type === "image" ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${service.media.filepath}`} // Assuming filepath contains the path to the image
                              alt={`${service.media.filename}`}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <span>{service.media.iframe}</span>
                          )}
                        </td>
                        <td className="text-center">
                          {/* <button title="Edit" onClick={() => navigate(`/edit/team/${user._id}`)}>
                    <CreateIcon />
                  </button>  */}
                          <Link
                            to={`/admin/edit/service/${service._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(service._id)}
                          >
                            <i class="las la-trash"></i>
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

export default AdminServices;
