import React, { useEffect, useState } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        // const response = await axios.get("/api/user/allUsers");
        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "gallery",
        });
        console.log(response.data.galleries);
        setGalleries(response.data.galleries);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGalleries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `gallery/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setGalleries(null); // Update user state to null after deletion
      // setTimeout(() => {
      //   navigate("/admin/gallery");
      // }, 2000);
      console.log(response.data);
      setGalleries(galleries.filter((gallery) => gallery._id !== id));
      setTimeout(() => {
        navigate("/admin/gallery");
      }, 3000);
    } catch (error) {
      console.error("Error deleting gallery:", error);
    }
  };
  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Service Gallery
          <NavLink to="/admin/add/gallery" className="theme-cta">
            <i class="las la-plus-circle"></i>
            Add Service Gallery
          </NavLink>
        </h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              {/* <DataTable
        value={users}
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
          field="users.imageUrl"
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
                    <th>Service</th>
                    <th className="text-center">Gallery Name</th>
                    <th className="text-center">Media</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {galleries &&
                    galleries.map((gallery) => (
                      <tr key={gallery._id}>
                        <td>{gallery.service_name}</td>
                        <td className="text-center">{gallery.gallery_name}</td>
                        <td className="table-profile-img text-center">
                          {gallery.type === "image" ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${gallery.media.filepath}`} // Assuming filepath contains the path to the image
                              alt={`${gallery.media.filename}`}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <span>{gallery.media.iframe}</span>
                          )}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/edit/gallery/${gallery._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(gallery._id)}
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

export default Gallery;
