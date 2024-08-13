import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const GalleryName = () => {
  const [galleryNames, setGalleryNames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryName = async () => {
      try {
        // const response = await axios.get("/api/user/allUsers");

        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "gallery_name",
        });
        console.log(response.data.galleryNames);
        setGalleryNames(response.data.galleryNames);
      } catch (error) {
        console.error("Error fetching gallery name:", error);
      }
    };

    fetchGalleryName();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `gallery_name/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setGalleryNames(null); // Update user state to null after deletion
      setTimeout(() => {
        navigate("/admin/gallery_name");
      }, 2000);

      console.log(response.data);
      setGalleryNames(
        galleryNames.filter((galleryname) => galleryname._id !== id)
      );

      setTimeout(() => {
        navigate("/admin/gallery_name");
      }, 3000);
    } catch (error) {
      console.error("Error deleting gallery name:", error);
    }
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Service Gallery Name
          <NavLink to="/admin/add/gallery_name" className="theme-cta">
            <i class="las la-plus-circle"></i>
            Add Service Gallery Name
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
                    <th>Service Name</th>
                    <th className="text-center">Gallery Name</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryNames.length > 0 ? (
                    galleryNames.map((galleryname) => (
                      <tr key={galleryname.service_name_id}>
                        <td>{galleryname.service_name}</td>
                        <td className="text-center">
                          {galleryname.gallery_name}
                        </td>

                        <td className="text-center">
                          {/* <button title="Edit" onClick={() => navigate(`/edit/team/${user._id}`)}>
                  <CreateIcon />
                </button>  */}
                          <Link
                            to={`/admin/edit/gallery_name/${galleryname._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(galleryname._id)}
                          >
                            <i class="las la-trash"></i>{" "}
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

export default GalleryName;
