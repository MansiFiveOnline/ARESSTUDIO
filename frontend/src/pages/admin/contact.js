import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/adminLayout";
import { useNavigate } from "react-router-dom";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // const response = await axios.get("/api/user/allUsers");

        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: "contact",
        });
        console.log(response.data.contacts);
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios({
        method: "DELETE",
        baseURL: `${apiUrl}/api/`,
        url: `contact/${id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setContacts(null); // Update user state to null after deletion

      console.log(response.data);
      setContacts(contacts.filter((contact) => contact._id !== id));
      setTimeout(() => {
        navigate("/admin/contact");
      }, 2000);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <Layout>
      <div className="pages-headers ">
        <h2>Contacts</h2>
      </div>
      <div className="row mobilerows">
        <div className="col-md-12">
          <div className="infos-table">
            <div className="table-responsive">
              <table id="example" className="table nowrap">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{contact.message}</td>

                        <td className="text-center">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(contact._id)}
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

export default AdminContact;
