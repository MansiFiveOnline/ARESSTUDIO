import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const Password = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        // const response = await axios.get("/api/user/allemail");
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "email",
        });
        console.log(response.data.emails);
        setEmails(response.data.emails);
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmails();
  }, []);

  const handleCopy = (password) => {
    navigator.clipboard.writeText(password).then(
      () => {
        console.log("Password copied to clipboard!");
        alert("Password copied to clipboard!");
      },
      (error) => {
        console.error("Could not copy password:", error);
      }
    );
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>Passwords</h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              <table id="example" className="table nowrap">
                <thead>
                  <tr>
                    <th>Email</th>

                    <th>Password</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.length > 0 ? (
                    emails.map((email) => (
                      <tr key={email._id}>
                        <td>{email.email}</td>
                        <td>{email.password}</td>
                        <td className="text-center">
                          {email.password ? (
                            <Link
                              to={`/admin/edit/password/${email._id}`}
                              title="Edit"
                            >
                              <i className="las la-pencil-alt"></i>
                            </Link>
                          ) : (
                            <Link
                              to={`/admin/edit/password/${email._id}`}
                              title="Edit"
                              className="disabled-link"
                              style={{ pointerEvents: "none", opacity: 0.5 }}
                            >
                              <i className="las la-pencil-alt"></i>
                            </Link>
                          )}
                        </td>
                        <td className="text-center">
                          {email.password ? (
                            <Link
                              to={`/admin/add/password/${email._id}`}
                              title="Add"
                              className="disabled-link"
                              style={{ pointerEvents: "none", opacity: 0.5 }}
                            >
                              <i className="las la-plus-circle"></i>
                            </Link>
                          ) : (
                            <Link
                              to={`/admin/add/password/${email._id}`}
                              title="Add"
                            >
                              <i className="las la-plus-circle"></i>
                            </Link>
                          )}
                        </td>
                        <td className="text-center">
                          {email.password ? (
                            <button
                              className="delete-btn"
                              onClick={() => handleCopy(email.password)}
                            >
                              <i className="las la-copy"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCopy(email.password)}
                              className="delete-btn disabled-link"
                              style={{ pointerEvents: "none", opacity: 0.5 }}
                            >
                              <i className="las la-copy"></i>
                            </button>
                          )}
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

export default Password;
