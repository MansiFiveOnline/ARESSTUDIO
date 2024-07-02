import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCareer = () => {
  const [careers, setCareers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        // const response = await axios.get("/api/user/allcareers");

        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "career",
        });
        console.log(response.data.careers);
        setCareers(response.data.careers);
      } catch (error) {
        console.error("Error fetching careers:", error);
      }
    };

    fetchCareers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");

      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `career/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setCareers(null); // Update user state to null after deletion
      console.log(response.data);
      setCareers(careers.filter((career) => career._id !== id));
      setTimeout(() => {
        navigate("/admin/career");
      }, 2000);
    } catch (error) {
      console.error("Error deleting career:", error);
    }
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Career
          <NavLink to="/admin/add/career" className="theme-cta">
            <i class="las la-plus-circle"></i>
            Add Career
          </NavLink>
        </h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              {/* <DataTable
        value={careers}
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
          field="careers.imageUrl"
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
                    <th>Title</th>
                    <th className="text-center">Subtitle</th>
                    <th className="text-center">Media</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {careers &&
                    careers.map((career) => (
                      <tr key={career._id}>
                        <td>{career.title}</td>
                        <td className="text-center">{career.subtitle}</td>
                        <td className="table-profile-img text-center">
                          {career.type === "image" ? (
                            <img
                              src={`http://localhost:8000/${career.media.filepath}`} // Assuming filepath contains the path to the image
                              alt={`${career.media.filename}`}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <span>{career.media.iframe}</span>
                          )}
                        </td>
                        <td className="text-center">
                          {/* <button title="Edit" onClick={() => navigate(`/edit/team/${user._id}`)}>
                  <CreateIcon />
                </button>  */}
                          <Link
                            to={`/admin/edit/career/${career._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(career._id)}
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

export default AdminCareer;
