// // import React, { useState, useEffect } from "react";
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import { Modal, Form, Button } from "react-bootstrap";
// // import axios from "axios";
// // import VideoPlayer from "../components/Videoplayer";
// // import { useParams, NavLink, useNavigate } from "react-router-dom"; // Import useHistory
// // import "../style/user.css";
// // import PasswordForm from "./passwordForm";
// // import EmailForm from "./emailForm";

// // const Gallery = ({ service_name }) => {
// //   const [selectedTab, setSelectedTab] = useState("all");
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedMedia, setSelectedMedia] = useState(null);
// //   const [galleryNames, setGalleryNames] = useState([]);
// //   const [media, setMedia] = useState([]);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [showEmailForm, setShowEmailForm] = useState(true); // New state to manage form visibility
// //   const navigate = useNavigate(); // Access history object
// //   // const [formattedProjectName, setFormattedProjectName] = useState("");
// //   const [navigateToServiceDetail, setNavigateToServiceDetail] = useState(false); // State to trigger navigation
// //   const [selectedMediaForNavigation, setSelectedMediaForNavigation] =
// //     useState(null); // State to store selected media for navigation

// //   const { id } = useParams();

// //   useEffect(() => {
// //     const fetchGalleryNames = async () => {
// //       try {
// //         const response = await axios.get(
// //           `/api/gallery_name/gallerynames?service_name=${service_name}`
// //         );
// //         setGalleryNames(response.data.galleryNames);
// //       } catch (error) {
// //         console.error("Error fetching gallery names:", error);
// //       }
// //     };

// //     if (service_name) {
// //       fetchGalleryNames();
// //     }
// //   }, [service_name]);

// //   useEffect(() => {
// //     const fetchProjectMedia = async () => {
// //       console.log("Gallery Name", selectedTab);
// //       try {
// //         let response;
// //         if (selectedTab === "all") {
// //           response = await axios.get(
// //             `/api/project/project_media?service_name=${service_name}&gallery_name=all`
// //           );
// //         } else {
// //           response = await axios.get(
// //             `/api/project/project_media?service_name=${service_name}&gallery_name=${selectedTab}`
// //           );
// //         }

// //         if (response.data && response.data.media) {
// //           const mediaArray = Array.isArray(response.data.media)
// //             ? response.data.media
// //             : [response.data.media];
// //           setMedia(mediaArray);
// //         } else if (response.data.media.length === 0) {
// //           setErrorMessage(
// //             "No media found for the given service and gallery name."
// //           );
// //         } else {
// //           setMedia(response.data.media);
// //           setErrorMessage("");
// //         }
// //       } catch (error) {
// //         setErrorMessage("Error fetching media.");
// //         console.error("Error fetching gallery media:", error);
// //       }
// //     };

// //     if (service_name) {
// //       fetchProjectMedia();
// //     }
// //   }, [selectedTab, service_name]);

// //   const handleTabSelect = (tab) => {
// //     setSelectedTab(tab);
// //   };

// //   const handleMediaClick = async (media) => {
// //     try {
// //       setSelectedMedia(media);
// //       if (media.isPublic) {
// //         // If media is public, navigate to the service detail page

// //         const formattedProjectName = decodeURIComponent(media.project_Name)
// //           .toLowerCase()
// //           .trim()
// //           .replace(/\s+/g, "-"); // Replace spaces with hyphens
// //         navigate(`/service-detail/${formattedProjectName}`);
// //         console.log("formatted project name", formattedProjectName);
// //       } else {
// //         // setFormattedProjectName(media.projectName); // Set the project name directly
// //         // If media is not public, show modal
// //         setModalVisible(true);
// //       }
// //       console.log("Selected Media:", media);
// //     } catch (error) {
// //       console.error("Error fetching media details:", error);
// //     }
// //   };

// //   const handleEmailSubmit = async (email) => {
// //     try {
// //       const response = await axios.post("/api/email", { email });
// //       if (response.status === 200) {
// //         setShowEmailForm(false);
// //       }
// //     } catch (error) {
// //       console.error("Error submitting email:", error);
// //     }
// //   };

// //   const handlePasswordSubmit = async (password) => {
// //     const isValidPassword = true; // Implement password validation logic
// //     console.log("selected project name", selectedMedia.projectName);
// //     if (isValidPassword && selectedMedia && selectedMedia.projectName) {
// //       setSelectedMediaForNavigation(selectedMedia);
// //       setNavigateToServiceDetail(true); // Set the state to trigger navigation
// //     } else {
// //       alert("Incorrect password or project name is missing! Please try again.");
// //     }
// //   };

// //   // Navigate to service detail when state changes
// //   useEffect(() => {
// //     if (navigateToServiceDetail && selectedMediaForNavigation) {
// //       const formattedProjectName = selectedMediaForNavigation.projectName
// //         .toLowerCase()
// //         .trim()
// //         .replace(/\s+/g, "-");
// //       navigate(`/service-detail/${formattedProjectName}`);
// //     }
// //   }, [navigateToServiceDetail, selectedMediaForNavigation, navigate]);

// //   return (
// //     <div className="">
// //       <ul className="nav nav-tabs">
// //         <li className="nav-item">
// //           <button
// //             className={`nav-link ${selectedTab === "all" ? "active" : ""}`}
// //             onClick={() => handleTabSelect("all")}
// //           >
// //             All
// //           </button>
// //         </li>
// //         {galleryNames.map((galleryName) => (
// //           <li key={galleryName} className="nav-item">
// //             <button
// //               className={`nav-link ${
// //                 selectedTab === galleryName ? "active" : ""
// //               }`}
// //               onClick={() => handleTabSelect(galleryName)}
// //             >
// //               {galleryName}
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //       {errorMessage ? (
// //         <p className="text-center">{errorMessage}</p>
// //       ) : (
// //         <div className="row mt-3">
// //           {Array.isArray(media) &&
// //             media.map((item, index) => (
// //               <div key={index} className="col-md-4">
// //                 <div className="card">
// //                   <div
// //                     className="media_box position-relative"
// //                     onClick={() => handleMediaClick(item)}
// //                   >
// //                     {item.iframe ? (
// //                       <VideoPlayer
// //                         src={item.iframe}
// //                         type="video/mp4"
// //                         className="card-img-top"
// //                         controls
// //                       />
// //                     ) : (
// //                       <img
// //                         src={
// //                           item.filepath
// //                             ? `http://localhost:8000/${item.filepath}`
// //                             : "path_to_placeholder_image"
// //                         }
// //                         className="card-img-top"
// //                         alt={`Media ${index}`}
// //                       />
// //                     )}
// //                     {!item.isPublic && (
// //                       <div className="locked-media">
// //                         <img
// //                           src="images/lock-icon.svg"
// //                           className="lock_icon"
// //                           alt="Lock Icon"
// //                         />
// //                       </div>
// //                     )}
// //                     <div className="project-name">
// //                       {item.projectName} {/* Display project name */}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //         </div>
// //       )}
// //       {selectedMedia && !selectedMedia.isPublic && (
// //         <Modal
// //           className="media_modal locked_modal"
// //           show={modalVisible}
// //           onHide={() => setModalVisible(false)}
// //         >
// //           <Modal.Header closeButton></Modal.Header>
// //           <Modal.Body>
// //             {showEmailForm ? (
// //               <EmailForm onSubmit={handleEmailSubmit} />
// //             ) : (
// //               <PasswordForm
// //                 onSubmit={handlePasswordSubmit}
// //                 projectName={selectedMedia?.projectName}
// //                 navigate={navigate} // Pass the navigate function
// //               />
// //             )}
// //           </Modal.Body>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // };

// // export default Gallery;

// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal } from "react-bootstrap";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import { useNavigate } from "react-router-dom"; // Import useHistory
// import "../style/user.css";
// import PasswordForm from "./passwordForm";
// import EmailForm from "./emailForm";

// const Gallery = ({ service_name }) => {
//   const [selectedTab, setSelectedTab] = useState("all");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [galleryNames, setGalleryNames] = useState([]);
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [submittedMedia, setSubmittedMedia] = useState(null); // Track submitted media
//   const navigate = useNavigate(); // Access navigate function from React Router

//   const apiUrl = process.env.REACT_APP_API_URL;
//   useEffect(() => {
//     const fetchGalleryNames = async () => {
//       try {
//         // const apiUrl = process.env.REACT_APP_API_URL;

//         const response = await axios.get(
//           `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
//         );
//         setGalleryNames(response.data.galleryNames);
//       } catch (error) {
//         console.error("Error fetching gallery names:", error);
//       }
//     };

//     if (service_name) {
//       fetchGalleryNames();
//     }
//   }, [service_name]);

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       console.log("Gallery Name", selectedTab);
//       try {
//         let response;
//         if (selectedTab === "all") {
//           // const apiUrl = process.env.REACT_APP_API_URL;

//           response = await axios.get(
//             `${apiUrl}/api/project/project_media?service_name=${service_name}&gallery_name=all`
//           );
//         } else {
//           response = await axios.get(
//             `${apiUrl}/api/project/project_media?service_name=${service_name}&gallery_name=${selectedTab}`
//           );
//         }

//         if (response.data && response.data.media) {
//           const mediaArray = Array.isArray(response.data.media)
//             ? response.data.media
//             : [response.data.media];
//           setMedia(mediaArray);
//           console.log(mediaArray);
//         } else if (response.data.media.length === 0) {
//           setErrorMessage(
//             "No media found for the given service and gallery name."
//           );
//         } else {
//           setMedia(response.data.media);

//           setErrorMessage("");
//         }
//       } catch (error) {
//         setErrorMessage("Error fetching media.");
//         console.error("Error fetching gallery media:", error);
//       }
//     };

//     if (service_name) {
//       fetchProjectMedia();
//     }
//   }, [selectedTab, service_name]);

//   const fetchProjectName = async () => {};

//   const handleTabSelect = (tab) => {
//     setSelectedTab(tab);
//   };

//   // const handleMediaClick = async (media) => {
//   //   try {
//   //     setSelectedMedia(media);
//   //     console.log("Selected Media:", media); // Add this line
//   //     if (media.isPublic) {
//   //       const formattedProjectName = decodeURIComponent(media.project_Name)
//   //         .toLowerCase()
//   //         .trim()
//   //         .replace(/\s+/g, "-");
//   //       navigate(`/service-detail/${formattedProjectName}`);
//   //     } else {
//   //       setModalVisible(true);
//   //       setSubmittedMedia(media); // Track the submitted media
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching media details:", error);
//   //   }
//   // };

//   const handleMediaClick = async (media) => {
//     try {
//       setSelectedMedia(media);
//       console.log("Selected Media:", media); // Add this line
//       if (media.isPublic) {
//         const formattedProjectName = decodeURIComponent(media.project_Name)
//           .toLowerCase()
//           .trim()
//           .replace(/\s+/g, "-");
//         navigate(`/service-detail/${formattedProjectName}`);
//       } else {
//         setModalVisible(true);
//         setShowEmailForm(false); // Show password form by default
//         setSubmittedMedia(media); // Track the submitted media
//       }
//     } catch (error) {
//       console.error("Error fetching media details:", error);
//     }
//   };

//   useEffect(() => {
//     const emailFormSubmitted = localStorage.getItem("emailFormSubmitted");
//     if (emailFormSubmitted === "true") {
//       setShowEmailForm(false);
//     }
//   }, []);

//   // const handleEmailSubmit = async (email) => {
//   //   try {
//   //     const response = await axios.post(`${apiUrl}/api/email`, {
//   //       email,
//   //     });
//   //     if (response.status === 200) {
//   //       // Set flag indicating email form has been submitted
//   //       localStorage.setItem("submittedMedia", JSON.stringify(selectedMedia));
//   //       localStorage.setItem("emailFormSubmitted", "true");
//   //       setShowEmailForm(false);
//   //       console.log("selectedMedia before", selectedMedia);
//   //       setSubmittedMedia(selectedMedia);
//   //       console.log("selectedMedia after", selectedMedia);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting email:", error);
//   //   }
//   // };

//   const handleEmailSubmit = async (email) => {
//     try {
//       const response = await axios.post(`${apiUrl}/api/email`, {
//         email,
//       });
//       if (response.status === 200) {
//         localStorage.setItem("submittedMedia", JSON.stringify(selectedMedia));
//         localStorage.setItem("emailFormSubmitted", "true");
//         setShowEmailForm(false); // Reset to hide email form
//         setSubmittedMedia(selectedMedia);
//       }
//     } catch (error) {
//       console.error("Error submitting email:", error);
//     }
//   };

//   const handlePasswordSubmit = async (password) => {
//     try {
//       // Assuming no password validation is needed, proceed directly to redirect
//       const apiUrl = process.env.REACT_APP_API_URL;

//       const response = await axios.post(
//         `${apiUrl}/api/email/validate-password`,
//         { password }
//       );

//       if (response.data.isValid) {
//         if (submittedMedia === selectedMedia && selectedMedia.projectName) {
//           const formattedProjectName = decodeURIComponent(
//             selectedMedia.projectName
//           )
//             .toLowerCase()
//             .trim()
//             .replace(/\s+/g, "-");
//           navigate(`/service-detail/${formattedProjectName}`);
//         } else {
//           console.error("Project name is undefined.");
//         }
//       } else {
//         alert("Incorrect password! Please try again.");
//       }
//     } catch (error) {
//       console.error("Error validating password:", error);
//     }
//   };

//   const handleLinkClick = () => {
//     localStorage.removeItem("submittedMedia", JSON.stringify(selectedMedia));
//     localStorage.removeItem("emailFormSubmitted", "true");
//     setShowEmailForm(true);
//   };

//   return (
//     <div className="">
//       <ul className="nav nav-tabs">
//         <li className="nav-item">
//           <button
//             className={`nav-link ${selectedTab === "all" ? "active" : ""}`}
//             onClick={() => handleTabSelect("all")}
//           >
//             All
//           </button>
//         </li>
//         {galleryNames.map((galleryName) => (
//           <li key={galleryName} className="nav-item">
//             <button
//               className={`nav-link ${
//                 selectedTab === galleryName ? "active" : ""
//               }`}
//               onClick={() => handleTabSelect(galleryName)}
//             >
//               {galleryName}
//             </button>
//           </li>
//         ))}
//       </ul>
//       {errorMessage ? (
//         <p className="text-center">{errorMessage}</p>
//       ) : (
//         <div className="row mt-3">
//           {Array.isArray(media) &&
//             media.map((item, index) => (
//               <div key={index} className="col-md-4">
//                 <div className="card">
//                   <div
//                     className="media_box position-relative"
//                     onClick={() => handleMediaClick(item)}
//                   >
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={
//                           item.filepath
//                             ? `${apiUrl}/${item.filepath}`
//                             : "path_to_placeholder_image"
//                         }
//                         className="card-img-top"
//                         alt={`Media ${index}`}
//                         loading="lazy"
//                       />
//                     )}
//                     {!item.isPublic && (
//                       <div className="locked-media">
//                         <img
//                           src="/images/lock-icon.svg"
//                           className="lock_icon"
//                           alt="Lock Icon"
//                           loading="lazy"
//                         />
//                       </div>
//                     )}

//                     <div className="project-name">
//                       <h3>{item.project_Name || item.projectName} </h3>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}
//       {selectedMedia && !selectedMedia.isPublic && (
//         <Modal
//           className="media_modal locked_modal"
//           show={modalVisible}
//           onHide={() => setModalVisible(false)}
//         >
//           <Modal.Header closeButton></Modal.Header>
//           {/* <Modal.Body>
//             {showEmailForm ? (
//               <EmailForm onSubmit={handleEmailSubmit} />
//             ) : (
//               submittedMedia === selectedMedia && ( // Only show password form if submittedMedia is not null
//                 <PasswordForm
//                   onSubmit={handlePasswordSubmit}
//                   projectName={selectedMedia?.project_Name}
//                   navigate={navigate} // Pass the navigate function
//                 />
//               )
//             )}
//           </Modal.Body> */}

//           {/* <Modal.Body>
//             {showEmailForm ? (
//               <EmailForm onSubmit={handleEmailSubmit} />
//             ) : (
//               submittedMedia &&
//               JSON.stringify(submittedMedia) ===
//                 localStorage.getItem("submittedMedia") && (
//                 <PasswordForm
//                   onSubmit={handlePasswordSubmit}
//                   projectName={selectedMedia?.project_Name}
//                   navigate={navigate}
//                 />
//               )
//             )}
//           </Modal.Body> */}
//           {/*
//           <Modal.Body>
//             {submittedMedia &&
//             JSON.stringify(submittedMedia) ===
//               localStorage.getItem("submittedMedia") ? (
//               <EmailForm onSubmit={handleEmailSubmit} />
//             ) : (
//               // <EmailForm onSubmit={handleEmailSubmit} />
//               <PasswordForm
//                 onSubmit={handlePasswordSubmit}
//                 projectName={selectedMedia?.project_Name}
//                 navigate={navigate}
//                 onLinkClick={handleLinkClick}
//               />
//             )}
//           </Modal.Body> */}

//           <Modal.Body>
//             {!showEmailForm && (
//               <PasswordForm
//                 onSubmit={handlePasswordSubmit}
//                 projectName={selectedMedia?.project_Name}
//                 navigate={navigate}
//                 onLinkClick={handleLinkClick}
//               />
//             )}
//             {showEmailForm && <EmailForm onSubmit={handleEmailSubmit} />}
//           </Modal.Body>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Gallery;

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import axios from "axios";
import VideoPlayer from "./Videoplayer";
import { useNavigate } from "react-router-dom"; // Import useHistory
import "../style/user.css";
import PasswordForm from "./passwordForm";
import EmailForm from "./emailForm";

const Gallery = ({ service_name }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [galleryNames, setGalleryNames] = useState([]);
  const [media, setMedia] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submittedMedia, setSubmittedMedia] = useState(null); // Track submitted media
  const navigate = useNavigate(); // Access navigate function from React Router
  const currentVideoRef = useRef(null); // Ref to store the currently playing video

  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchGalleryNames = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
        );
        setGalleryNames(response.data.galleryNames);
      } catch (error) {
        console.error("Error fetching gallery names:", error);
      }
    };

    if (service_name) {
      fetchGalleryNames();
    }
  }, [service_name]);

  useEffect(() => {
    const fetchProjectMedia = async () => {
      console.log("Gallery Name", selectedTab);
      try {
        let response;
        if (selectedTab === "all") {
          response = await axios.get(
            `${apiUrl}/api/project/project_media?service_name=${service_name}&gallery_name=all`
          );
        } else {
          response = await axios.get(
            `${apiUrl}/api/project/project_media?service_name=${service_name}&gallery_name=${selectedTab}`
          );
        }

        if (response.data && response.data.media) {
          const mediaArray = Array.isArray(response.data.media)
            ? response.data.media
            : [response.data.media];
          setMedia(mediaArray);
          console.log(mediaArray);
        } else if (response.data.media.length === 0) {
          setErrorMessage(
            "No media found for the given service and gallery name."
          );
        } else {
          setMedia(response.data.media);
          setErrorMessage("");
        }
      } catch (error) {
        setErrorMessage("Error fetching media.");
        console.error("Error fetching gallery media:", error);
      }
    };

    if (service_name) {
      fetchProjectMedia();
    }
  }, [selectedTab, service_name]);

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  const handleMediaClick = async (media) => {
    try {
      if (currentVideoRef.current) {
        currentVideoRef.current.pause(); // Pause the currently playing video
      }
      setSelectedMedia(media);
      console.log("Selected Media:", media); // Add this line
      if (media.isPublic) {
        const formattedProjectName = decodeURIComponent(media.project_Name)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
        navigate(`/service-detail/${formattedProjectName}`);
      } else {
        setModalVisible(true);
        setShowEmailForm(false); // Show password form by default
        setSubmittedMedia(media); // Track the submitted media
      }
    } catch (error) {
      console.error("Error fetching media details:", error);
    }
  };

  useEffect(() => {
    const emailFormSubmitted = localStorage.getItem("emailFormSubmitted");
    if (emailFormSubmitted === "true") {
      setShowEmailForm(false);
    }
  }, []);

  const handleEmailSubmit = async (email) => {
    try {
      const response = await axios.post(`${apiUrl}/api/email`, {
        email,
      });
      if (response.status === 200) {
        localStorage.setItem("submittedMedia", JSON.stringify(selectedMedia));
        localStorage.setItem("emailFormSubmitted", "true");
        setShowEmailForm(false); // Reset to hide email form
        setSubmittedMedia(selectedMedia);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  const handlePasswordSubmit = async (password) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.post(
        `${apiUrl}/api/email/validate-password`,
        { password }
      );

      if (response.data.isValid) {
        if (submittedMedia === selectedMedia && selectedMedia.projectName) {
          const formattedProjectName = decodeURIComponent(
            selectedMedia.projectName
          )
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
          navigate(`/service-detail/${formattedProjectName}`);
        } else {
          console.error("Project name is undefined.");
        }
      } else {
        alert("Incorrect password! Please try again.");
      }
    } catch (error) {
      console.error("Error validating password:", error);
    }
  };

  const handleLinkClick = () => {
    localStorage.removeItem("submittedMedia", JSON.stringify(selectedMedia));
    localStorage.removeItem("emailFormSubmitted", "true");
    setShowEmailForm(true);
  };

  return (
    <div className="">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${selectedTab === "all" ? "active" : ""}`}
            onClick={() => handleTabSelect("all")}
          >
            All
          </button>
        </li>
        {galleryNames.map((galleryName) => (
          <li key={galleryName} className="nav-item">
            <button
              className={`nav-link ${
                selectedTab === galleryName ? "active" : ""
              }`}
              onClick={() => handleTabSelect(galleryName)}
            >
              {galleryName}
            </button>
          </li>
        ))}
      </ul>
      {errorMessage ? (
        <p className="text-center">{errorMessage}</p>
      ) : (
        <div className="row mt-3">
          {Array.isArray(media) &&
            media.map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card">
                  <div
                    className="media_box position-relative"
                    onClick={() => handleMediaClick(item)}
                  >
                    {item.iframe ? (
                      <VideoPlayer
                        src={item.iframe}
                        type="video/mp4"
                        className="card-img-top"
                        controls
                        ref={currentVideoRef} // Set the current video ref
                      />
                    ) : (
                      <img
                        src={
                          item.filepath
                            ? `${apiUrl}/${item.filepath}`
                            : "path_to_placeholder_image"
                        }
                        className="card-img-top"
                        alt={`Media ${index}`}
                        loading="lazy"
                      />
                    )}
                    {!item.isPublic && (
                      <div className="locked-media">
                        <img
                          src="/images/lock-icon.svg"
                          className="lock_icon"
                          alt="Lock Icon"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="project-name">
                      <h3>{item.project_Name || item.projectName} </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {selectedMedia && !selectedMedia.isPublic && (
        <Modal
          className="media_modal locked_modal"
          show={modalVisible}
          onHide={() => setModalVisible(false)}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            {!showEmailForm && (
              <PasswordForm
                onSubmit={handlePasswordSubmit}
                projectName={selectedMedia?.project_Name}
                navigate={navigate}
                onLinkClick={handleLinkClick}
              />
            )}
            {showEmailForm && <EmailForm onSubmit={handleEmailSubmit} />}
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Gallery;
