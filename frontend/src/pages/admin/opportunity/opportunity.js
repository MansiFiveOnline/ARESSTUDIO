import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // const response = await axios.get("/api/user/allUsers");

        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "opportunity",
        });
        console.log(response.data.opportunities);
        setOpportunities(response.data.opportunities);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOpportunities();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `opportunity/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setOpportunities(null); // Update user state to null after deletion

      console.log(response.data);
      setOpportunities(
        opportunities.filter((opportunity) => opportunity._id !== id)
      );

      setTimeout(() => {
        navigate("/admin/opportunities");
      }, 2000);
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>
          Opportunities
          <NavLink to="/admin/add/opportunity" className="theme-cta">
            <i class="las la-plus-circle"></i>
            Add Opportunity
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
                    <th>Title</th>
                    <th className="text-center">Description</th>
                    {/* <th className="text-center">Responsibility</th> */}
                    {/* <th className="text-center">Qualification</th> */}
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities &&
                    opportunities.map((opportunity) => (
                      <tr key={opportunity._id}>
                        <td>{opportunity.title}</td>
                        <td className="text-center">
                          {opportunity.description}
                        </td>
                        {/* <td className="text-center">
                          {opportunity.responsibility}
                        </td>
                        <td className="text-center">
                          {opportunity.qualification}
                        </td> */}

                        <td className="text-center">
                          {/* <button title="Edit" onClick={() => navigate(`/edit/team/${user._id}`)}>
                  <CreateIcon />
                </button>  */}
                          <Link
                            to={`/admin/edit/opportunity/${opportunity._id}`}
                            title="Edit"
                          >
                            <i class="las la-pencil-alt"></i>
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(opportunity._id)}
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

export default Opportunities;
