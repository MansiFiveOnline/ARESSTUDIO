// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Layout from "../../../components/adminLayout";
// import { useParams, useNavigate } from "react-router-dom";

// const EditTeam = () => {
//   const { id } = useParams(); // Assuming the parameter is named teamId
//   const [team, setTeam] = useState(null);
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     designation: "",
//     linkedin_url: "",
//     sequence: "",
//     image: null, // Initially, set to null
//   });

//   useEffect(() => {
//     console.log("ID", id);

//     const fetchTeam = async () => {
//       try {
//         const apiUrl = process.env.REACT_APP_API_URL;

//         const response = await axios({
//           method: "GET",
//           baseURL: `${apiUrl}/api/`,
//           url: `/team/${id}`,
//         });
//         console.log(response.data.team);
//         setTeam(response.data.team);

//         setFormData({
//           name: response.data.team.name,
//           designation: response.data.team.designation,
//           linkedin_url: response.data.team.linkedin_url,
//           sequence: response.data.team.sequence,
//           image: response.data.team.image
//             ? {
//                 filename: response.data.team.image[0].filename,
//                 filepath: response.data.team.image[0].filepath.replace(
//                   /\\/g,
//                   "/"
//                 ), // Replace backslashes with forward slashes
//               }
//             : null,
//         });
//       } catch (error) {
//         console.error("Error fetching team:", error);
//       }
//     };

//     fetchTeam();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image") {
//       if (files && files.length > 0) {
//         setFormData({
//           ...formData,
//           image: {
//             file: files[0],
//             filename: files[0].name,
//             filepath: URL.createObjectURL(files[0]),
//           },
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("designation", formData.designation);
//       formDataToSend.append("linkedin_url", formData.linkedin_url);
//       formDataToSend.append("sequence", formData.sequence);

//       if (formData.image?.file) {
//         formDataToSend.append("image", formData.image.file);
//       }

//       const access_token = localStorage.getItem("access_token");
//       const apiUrl = process.env.REACT_APP_API_URL;

//       const response = await axios({
//         method: "PATCH",
//         baseURL: `${apiUrl}/api/`,
//         url: `/team/${id}`,
//         data: formDataToSend,
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${access_token}`,
//         },
//       });

//       navigate("/admin/team");
//       console.log(response.data.team);
//     } catch (error) {
//       console.error("Error updating team:", error);
//       setErrorMessage(
//         `${error.response?.data?.message}` || "An error occurred"
//       );
//     }
//   };

//   return (
//     <Layout>
//       <div className="theme-form-header">
//         <h2>Edit team</h2>
//       </div>
//       <div className="form-white-bg">
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Designation</label>
//                 <input
//                   type="text"
//                   name="designation"
//                   value={formData.designation}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>LinkedIn URL</label>
//                 <input
//                   type="text"
//                   name="linkedin_url"
//                   value={formData.linkedin_url}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Sequence</label>
//                 <input
//                   type="text"
//                   name="sequence"
//                   value={formData.sequence}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Image (500 X 750)</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept=".webp"
//                   onChange={handleChange}
//                 />
//                 {formData.image?.filepath && (
//                   <img
//                     className="form-profile"
//                     src={`${process.env.REACT_APP_API_URL}/${formData.image.filepath}`}
//                     alt="Media"
//                     loading="lazy"
//                   />
//                 )}
//               </div>
//             </div>

//             {errorMessage && (
//               <div className="error-message text-danger mt-2">
//                 {errorMessage}
//               </div>
//             )}

//             <div className="col-12">
//               <div className="theme-form">
//                 <button type="submit">Save</button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default EditTeam;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../../components/adminLayout";
import { useParams, useNavigate } from "react-router-dom";

const EditTeam = () => {
  const { id } = useParams(); // Assuming the parameter is named teamId
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    linkedin_url: "",
    sequence: "",
    image: null, // Initially, set to null
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios({
          method: "GET",
          baseURL: `${apiUrl}/api/`,
          url: `/team/${id}`,
        });

        setTeam(response.data.team);

        setFormData({
          name: response.data.team.name,
          designation: response.data.team.designation,
          linkedin_url: response.data.team.linkedin_url,
          sequence: response.data.team.sequence,
          image: response.data.team.image
            ? {
                filename: response.data.team.image[0].filename,
                filepath: response.data.team.image[0].filepath.replace(
                  /\\/g,
                  "/"
                ), // Replace backslashes with forward slashes
              }
            : null,
        });
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchTeam();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      if (files && files.length > 0) {
        setFormData({
          ...formData,
          image: {
            file: files[0],
            filename: files[0].name,
            filepath: URL.createObjectURL(files[0]),
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("linkedin_url", formData.linkedin_url);
      formDataToSend.append("sequence", formData.sequence);

      if (formData.image?.file) {
        formDataToSend.append("image", formData.image.file);
      }

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios({
        method: "PATCH",
        baseURL: `${apiUrl}/api/`,
        url: `/team/${id}`,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });

      navigate("/admin/team");
      console.log(response.data.team);
    } catch (error) {
      console.error("Error updating team:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit team</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Sequence</label>
                <input
                  type="text"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Image (500 X 750)</label>
                <input
                  type="file"
                  name="image"
                  accept=".webp"
                  onChange={handleChange}
                />
                {formData.image?.filepath && (
                  <img
                    className="form-profile"
                    src={`${process.env.REACT_APP_API_URL}/${formData.image.filepath}`}
                    alt="Media"
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="error-message text-danger mt-2">
                {errorMessage}
              </div>
            )}

            <div className="col-12">
              <div className="theme-form">
                <button type="submit">Save</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditTeam;
