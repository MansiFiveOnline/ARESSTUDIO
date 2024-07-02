// import React, { useEffect, useState } from "react";
// import Layout from "../../components/layout";
// import HorizontalTabs from "../../components/HorizontalTabs";
// import "../../style/user.css";
// import axios from "axios";
// import VideoPlayer from "../../components/Videoplayer";
// import { Helmet } from "react-helmet";

// export default function Career() {
//   const [careerData, setCareerData] = useState(null);
//   const [opportunities, setOpportunities] = useState(null);
//   const [opportunityTitles, setOpportunityTitles] = useState([]);
//   const [selectedTitle, setSelectedTitle] = useState("");
//   const [metaData, setMetaData] = useState({
//     metaTitle: "",
//     metaDescription: "",
//   });
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_no: "",
//     location: "",
//     position: "",
//     message: "",
//     document: null,
//   });

//   useEffect(() => {
//     const fetchCareer = async () => {
//       try {
//         const response = await axios.get(`/api/career`);
//         setCareerData(response.data.careers);
//         console.log(response.data.careers);
//         console.log("title", response.data.careers[0].title);

//         // console.log("filepath", response.data.careers.media[0].filepath);
//         if (response.data.careers && response.data.careers.length > 0) {
//           console.log("filepath", response.data.careers[0].media.filepath);
//         }
//       } catch (error) {
//         console.error("Error fetching careers details:", error);
//       }
//     };

//     fetchCareer();
//   }, []);

//   useEffect(() => {
//     const fetchTitle = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/opportunity/title"
//         );
//         setOpportunityTitles(response.data.opportunityTitles);
//       } catch (error) {
//         console.error("Error fetching opportunity titles:", error);
//       }
//     };

//     fetchTitle();
//   }, []);

//   useEffect(() => {
//     const fetchOpportunities = async () => {
//       try {
//         const response = await axios.get(`/api/opportunity`);
//         setOpportunities(response.data.opportunities);
//       } catch (error) {
//         console.error("Error fetching opportunities:", error);
//       }
//     };

//     fetchOpportunities();
//   }, []);

//   if (!opportunities && !careerData) {
//     return <div>Loading...</div>;
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, document: file });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     for (const key in formData) {
//       data.append(key, formData[key]);
//       // data.append("position", selectedTitle);
//     }

//     try {
//       const access_token = localStorage.getItem("access_token");
//       const response = await axios.post(
//         "http://localhost:8000/api/jobapplication",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         }
//       );
//       console.log(response.data);
//       alert("Application submitted successfully");
//     } catch (error) {
//       console.error("Error submitting application:", error);
//       alert("Error submitting application");
//     }
//   };

//   return (
//     <Layout>
//       {careerData && (
//         <Helmet>
//           {/* Meta tags specific to the About page */}
//           <title>{careerData[0].metaTitle}</title>
//           <meta name="title" content={careerData[0].metaTitle} />
//           <meta name="description" content={careerData[0].metaDescription} />
//           {/* Add other meta tags as needed */}
//         </Helmet>
//       )}
//       {/* Header banner section start */}
//       <div className="service_section position-relative">
//         <div className="app">
//           <div className="video-list">
//             {/* <VideoPlayer src="images/video2.mp4" /> */}
//             {/* <img src="images/service-detail.jpg" /> */}

//             {/* {careerData.media && careerData.media.iframe ? (
//               <VideoPlayer src={careerData.media.iframe} />
//             ) : (
//               <img
//                 src={`http://localhost:8000/${careerData.media.filepath}`}
//                 alt="Media"
//               />
//             )} */}

//             {careerData[0]?.media && careerData[0]?.media.iframe ? (
//               <VideoPlayer src={careerData[0].media.iframe} />
//             ) : careerData[0]?.media && careerData[0]?.media.filepath ? (
//               <img
//                 src={`http://localhost:8000/${careerData[0].media.filepath}`}
//                 alt="Media"
//               />
//             ) : (
//               <div>No media available</div>
//             )}
//           </div>
//         </div>
//         <div className="service_title">
//           <h1>{careerData[0].title}</h1>
//         </div>
//         <div className="arrow_down">
//           <a href="#career">
//             <div class="sr-arrow sr-bounce"></div>
//           </a>
//         </div>
//       </div>
//       {/* Header banner section start */}

//       {/* Horizontal scrollin tabs section start */}
//       <section className="horizontal_tabs_section" id="career">
//         <HorizontalTabs opportunities={opportunities} />
//       </section>
//       {/* Horizontal scrollin tabs section close */}

//       {/* get in touch form section start */}
//       <section className="getin_section">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-4">
//               <div className="getin_touch_title">
//                 <h2>
//                   Let's <span>Get In</span> Touch
//                 </h2>
//               </div>
//             </div>
//             <div className="col-lg-8">
//               <div className="getin_touch_form">
//                 <form onSubmit={handleSubmit}>
//                   <div className="row">
//                     <div className="col-lg-6">
//                       <div class="mb-5">
//                         <input
//                           type="text"
//                           class="form-control"
//                           name="name"
//                           value={formData.name}
//                           placeholder="Name*"
//                           onChange={handleInputChange}
//                         />
//                         {/* <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div class="mb-5">
//                         <input
//                           type="email"
//                           class="form-control"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           placeholder="Email Address*"
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div class="mb-5">
//                         <input
//                           type="tel"
//                           class="form-control"
//                           name="phone_no"
//                           value={formData.phone_no}
//                           onChange={handleInputChange}
//                           placeholder="Phone Number*"
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6">
//                       <div class="mb-5">
//                         <input
//                           type="text"
//                           class="form-control"
//                           name="location"
//                           value={formData.location}
//                           onChange={handleInputChange}
//                           placeholder="Location*"
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-12">
//                       <div class="mb-5">
//                         <select
//                           class="form-select"
//                           // value={formData.position}
//                           // aria-label="Default select example"
//                           value={selectedTitle}
//                           onChange={(e) => setSelectedTitle(e.target.value)}
//                         >
//                           <option selected>Select Position</option>
//                           {opportunityTitles.map((opportunityTitle, index) => (
//                             <option key={index} value={opportunityTitle}>
//                               {opportunityTitle}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                     <div className="col-lg-12">
//                       <div class="mb-5">
//                         <input
//                           class="form-control"
//                           type="file"
//                           name="document"
//                           // value={formData.document}
//                           onChange={handleFileChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-12">
//                       <div class="mb-5">
//                         <textarea
//                           class="form-control"
//                           name="message"
//                           value={formData.message}
//                           onChange={handleInputChange}
//                           rows={3}
//                           placeholder="Message"
//                         ></textarea>
//                       </div>
//                     </div>
//                     <div className="col-lg-12">
//                       <div class="text-end">
//                         <button type="submit" class="btn">
//                           <img src="images/arrow-right.svg" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* get in touch form section close */}
//     </Layout>
//   );
// }

import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import HorizontalTabs from "../../components/HorizontalTabs";
import "../../style/user.css";
import axios from "axios";
import VideoPlayer from "../../components/Videoplayer";
import { Helmet } from "react-helmet";

export default function Career() {
  const [careerData, setCareerData] = useState(null);
  const [opportunities, setOpportunities] = useState(null);
  const [opportunityTitles, setOpportunityTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [metaData, setMetaData] = useState({
    metaTitle: "",
    metaDescription: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    location: "",
    position: "",
    message: "",
    document: null,
  });
  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(`${apiUrl}/api/career`);
        setCareerData(response.data.careers);
        console.log(response.data.careers);
        console.log("title", response.data.careers[0].title);

        if (response.data.careers && response.data.careers.length > 0) {
          console.log("filepath", response.data.careers[0].media.filepath);
        }
      } catch (error) {
        console.error("Error fetching careers details:", error);
      }
    };

    fetchCareer();
  }, []);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(`${apiUrl}/api/opportunity/title`);
        setOpportunityTitles(response.data.opportunityTitles);
      } catch (error) {
        console.error("Error fetching opportunity titles:", error);
      }
    };

    fetchTitle();
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(`${apiUrl}/api/opportunity`);
        setOpportunities(response.data.opportunities);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  if (!opportunities && !careerData) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, document: file });
    setInputErrors({ ...inputErrors, document: "" });
  };

  const validateForm = () => {
    const form = document.querySelector("form");
    const elements = form.elements;
    let errors = {};

    for (let element of elements) {
      if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.tagName === "SELECT"
      ) {
        if (!element.checkValidity()) {
          errors[element.name] = element.title || "This field is required";
        }
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    const data = new FormData();

    // Append other form fields
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone_no", formData.phone_no);
    data.append("location", formData.location);
    data.append("message", formData.message);
    data.append("document", formData.document);

    // Append selected title as a string
    data.append("position", selectedTitle);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      const access_token = localStorage.getItem("access_token");
      const response = await axios.post(`${apiUrl}/api/jobapplication`, data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log(response.data);
      setSuccessMessage("Application submitted successfully!");

      // Clear form data and messages after a delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone_no: "",
          location: "",
          position: "",
          message: "",
          document: null,
        });
        setSelectedTitle("");
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage("Some error occurred in form submission. Try again!");
      setSuccessMessage("");
    }
  };

  return (
    <Layout>
      {careerData && (
        <Helmet>
          {/* Meta tags specific to the About page */}
          <title>{careerData[0].metaTitle}</title>
          <meta name="title" content={careerData[0].metaTitle} />
          <meta name="description" content={careerData[0].metaDescription} />
          {/* Add other meta tags as needed */}
        </Helmet>
      )}
      {/* Header banner section start */}
      <div className="service_section position-relative">
        <div className="app">
          <div className="video-list">
            {careerData[0]?.media && careerData[0]?.media.iframe ? (
              <VideoPlayer src={careerData[0].media.iframe} />
            ) : careerData[0]?.media && careerData[0]?.media.filepath ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/${careerData[0].media.filepath}`}
                alt="Media"
              />
            ) : (
              <div>No media available</div>
            )}
          </div>
        </div>
        <div className="service_title">
          <h1>{careerData[0].title}</h1>
        </div>
        <div className="arrow_down">
          <a href="#career">
            <div className="sr-arrow sr-bounce"></div>
          </a>
        </div>
      </div>
      {/* Header banner section start */}

      {/* Horizontal scrollin tabs section start */}
      <section className="horizontal_tabs_section" id="career">
        <HorizontalTabs opportunities={opportunities} />
      </section>
      {/* Horizontal scrollin tabs section close */}

      {/* get in touch form section start */}
      <section className="getin_section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div className="getin_touch_title">
                <h2>
                  Let's <span>Get In</span> Touch
                </h2>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="getin_touch_form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-5">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          placeholder="Name*"
                          onChange={handleInputChange}
                          required
                          pattern="[A-Za-z\s]+"
                          title="Name should only contain letters"
                        />
                        {inputErrors.name && (
                          <div className="text-danger mt-1">
                            {inputErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-5">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address*"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-5">
                        <input
                          type="tel"
                          className="form-control"
                          name="phone_no"
                          value={formData.phone_no}
                          onChange={handleInputChange}
                          placeholder="Phone Number*"
                          required
                          title="Phone no should be only digits"
                          pattern="\d{10}"
                          maxLength={10}
                        />
                        {inputErrors.name && (
                          <div className="text-danger mt-1">
                            {inputErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-5">
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Location*"
                          required
                        />
                        {inputErrors.name && (
                          <div className="text-danger mt-1">
                            {inputErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-5">
                        <select
                          placeholder="Select Position"
                          className="form-select"
                          value={selectedTitle}
                          onChange={(e) => setSelectedTitle(e.target.value)}
                          required
                        >
                          {inputErrors.name && (
                            <div className="text-danger mt-1">
                              {inputErrors.name}
                            </div>
                          )}
                          <option value="">Select Position</option>
                          {opportunityTitles.map((opportunityTitle, index) => (
                            <option key={index} value={opportunityTitle}>
                              {opportunityTitle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-5">
                        <input
                          className="form-control"
                          type="file"
                          name="document"
                          accept=".pdf, .doc"
                          onChange={handleFileChange}
                          required
                        />
                        {inputErrors.name && (
                          <div className="text-danger mt-1">
                            {inputErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-5">
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Message"
                          required
                        ></textarea>
                        {inputErrors.name && (
                          <div className="text-danger mt-1">
                            {inputErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    {errorMessage && (
                      <div className="error-message text-danger mt-2">
                        {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className="success-message text-success mt-2">
                        {successMessage}
                      </div>
                    )}
                    <div className="col-lg-12">
                      <div className="text-end">
                        <button type="submit" className="btn">
                          <img src="images/arrow-right.svg" alt="Submit" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* get in touch form section close */}
    </Layout>
  );
}
