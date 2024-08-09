// import React, { useState, useEffect } from "react";
// import Layout from "../../../components/adminLayout";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EditService = () => {
//   const { id } = useParams();
//   const [service, setService] = useState(null);
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState("");

//   const [formData, setFormData] = useState({
//     service_name: "",
//     url: "",
//     title: "",
//     subtitle: "",
//     description: "",
//     media: {
//       file: null,
//       iframe: "",
//       filepath: "",
//     },
//     metaTitle: "",
//     metaDescription: "",
//   });

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const apiUrl = process.env.REACT_APP_API_URL;

//         const response = await axios.get(`${apiUrl}/api/service/${id}`);
//         setService(response.data.service);
//         setFormData({
//           service_name: response.data.service.service_name,
//           url: response.data.service.url,
//           title: response.data.service.title,
//           subtitle: response.data.service.subtitle,
//           description: response.data.service.description,
//           media: {
//             file: null,
//             iframe: response.data.service.media.iframe || "",
//             filepath: response.data.service.media.filepath || "",
//           },
//           metaTitle: response.data.service.metaTitle,
//           metaDescription: response.data.service.metaDescription,
//         });
//       } catch (error) {
//         console.error("Error fetching service:", error);
//       }
//     };

//     fetchService();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "media") {
//       if (files && files.length > 0) {
//         setFormData({
//           ...formData,
//           media: {
//             file: files[0],
//             filename: files[0].name,
//             filepath: URL.createObjectURL(files[0]),
//             iframe: "",
//           },
//         });
//       } else {
//         setFormData({
//           ...formData,
//           media: {
//             ...formData.media,
//             iframe: value,
//           },
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value.trim() === "" ? "" : value,
//       });
//     }
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       description: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("service_name", formData.service_name);
//       formDataToSend.append("url", formData.url);
//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("subtitle", formData.subtitle);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("metaTitle", formData.metaTitle);
//       formDataToSend.append("metaDescription", formData.metaDescription);

//       if (formData.media.file) {
//         formDataToSend.append("media", formData.media.file);
//       } else {
//         formDataToSend.append("media", formData.media.iframe.trim());
//       }

//       const access_token = localStorage.getItem("access_token");
//       const apiUrl = process.env.REACT_APP_API_URL;

//       const response = await axios.patch(
//         `${apiUrl}/api/service/${id}`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${access_token}`,
//           },
//         }
//       );

//       console.log("Updated service", response.data.updatedService);

//       navigate("/admin/services");
//     } catch (error) {
//       console.error("Error updating service:", error);
//       setErrorMessage(
//         `${error.response?.data?.message}` || "An error occurred"
//       );
//     }
//   };

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "list",
//     "bullet",
//     "indent",
//   ];

//   const modules = {
//     toolbar: [
//       [{ header: "1" }, { header: "2" }, { font: [] }],
//       [{ size: [] }],
//       ["bold", "italic"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//     ],
//   };

//   return (
//     <Layout>
//       <div className="theme-form-header">
//         <h2>Edit Service</h2>
//       </div>
//       <div className="form-white-bg">
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   name="service_name"
//                   value={formData.service_name}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>URL</label>
//                 <input
//                   type="text"
//                   name="url"
//                   value={formData.url}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Subtitle</label>
//                 <input
//                   type="text"
//                   name="subtitle"
//                   value={formData.subtitle || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Description</label>
//                 {/* <textarea
//                   type="text"
//                   name="description"
//                   value={formData.description || ""}
//                   onChange={handleChange}
//                   rows={4}
//                 /> */}
//                 <ReactQuill
//                   theme="snow"
//                   modules={modules}
//                   formats={formats}
//                   name="description"
//                   value={formData.description}
//                   onChange={handleDescriptionChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Media (1920 X 1080)</label>
//                 <input
//                   type="text"
//                   name="media"
//                   value={formData.media.iframe || ""}
//                   placeholder="iFrame URL"
//                   onChange={handleChange}
//                 />
//                 <span> OR </span>
//                 <input
//                   type="file"
//                   name="media"
//                   accept=".webp"
//                   onChange={handleChange}
//                 />
//                 {formData.media.filepath && (
//                   <img
//                     className="form-profile"
//                     src={`${process.env.REACT_APP_API_URL}/${formData.media.filepath}`}
//                     alt="Media"
//                     loading="lazy"
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Meta Title</label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="col-lg-6 col-md-6 col-sm-12 col-12">
//               <div className="theme-form">
//                 <label>Meta Description</label>
//                 <textarea
//                   type="text"
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleChange}
//                   rows={4}
//                 />
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

// export default EditService;

import React, { useState, useEffect } from "react";
import Layout from "../../../components/adminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    service_name: "",
    url: "",
    title: "",
    subtitle: "",
    description: "",
    media: {
      file: null,
      iframe: "",
      filepath: "",
    },
    posterImg: {
      file: null,
      filepath: "",
    },
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/service/${id}`);
        const serviceData = response.data.service;
        setService(serviceData);
        setFormData({
          service_name: serviceData.service_name,
          url: serviceData.url,
          title: serviceData.title,
          subtitle: serviceData.subtitle,
          description: serviceData.description,
          media: {
            file: null,
            iframe: serviceData.media.iframe || "",
            filepath: `${apiUrl}/${serviceData.media.filepath}` || "",
          },
          posterImg: {
            file: null,
            filepath: `${apiUrl}/${serviceData.posterImg.filepath}` || "",
          },
          metaTitle: serviceData.metaTitle,
          metaDescription: serviceData.metaDescription,
        });
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Update media field independently
    if (name === "media") {
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            file: files[0],
            iframe: "",
            filepath: URL.createObjectURL(files[0]),
          },
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          media: {
            ...prevFormData.media,
            file: null,
            iframe: value.trim(),
          },
        }));
      }
    }
    // Update posterImg field independently
    else if (name === "posterImg") {
      if (files && files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          posterImg: {
            file: files[0],
            filepath: URL.createObjectURL(files[0]),
          },
        }));
      }
    }
    // Update other fields
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.trim() === "" ? "" : value,
      }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("service_name", formData.service_name);
      formDataToSend.append("url", formData.url);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaDescription", formData.metaDescription);

      if (formData.media.file) {
        formDataToSend.append("media", formData.media.file);
      } else {
        formDataToSend.append("media", formData.media.iframe.trim());
      }

      if (formData.posterImg.file) {
        formDataToSend.append("posterImg", formData.posterImg.file);
      } else {
        formDataToSend.append("posterImg", formData.posterImg.filepath);
      }

      const access_token = localStorage.getItem("access_token");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.patch(
        `${apiUrl}/api/service/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Updated service", response.data.updatedService);
      navigate("/admin/services");
    } catch (error) {
      console.error("Error updating service:", error);
      setErrorMessage(
        `${error.response?.data?.message}` || "An error occurred"
      );
    }
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "list",
    "bullet",
    "indent",
  ];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
  };

  return (
    <Layout>
      <div className="theme-form-header">
        <h2>Edit Service</h2>
      </div>
      <div className="form-white-bg">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Name</label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>URL</label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Description</label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  name="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Media (1920 X 1080)</label>
                <input
                  type="text"
                  name="media"
                  value={formData.media.iframe || ""}
                  placeholder="iFrame URL"
                  onChange={handleChange}
                />
                <span> OR </span>
                <input
                  type="file"
                  name="media"
                  accept=".webp"
                  onChange={handleChange}
                />
                {formData.media.filepath && (
                  <img
                    className="form-profile"
                    src={formData.media.filepath}
                    alt={formData.media.filename}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Poster Image (for iPhone)</label>
                <input
                  type="file"
                  name="posterImg"
                  accept=".webp"
                  onChange={handleChange}
                />
                {formData.posterImg.filepath && (
                  <img
                    className="form-profile"
                    src={formData.posterImg.filepath}
                    alt={formData.posterImg.filename}
                    loading="lazy"
                  />
                )}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="theme-form">
                <label>Meta Description</label>
                <input
                  type="text"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                />
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

export default EditService;
