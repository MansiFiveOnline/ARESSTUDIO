import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/adminLayout";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Parse from "html-react-parser";

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
                  {opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                      <tr key={opportunity._id}>
                        <td>{opportunity.title}</td>
                        <td className="text-center">
                          {Parse(opportunity.description)}
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

export default Opportunities;
