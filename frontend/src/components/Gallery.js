// import React, { useState, useEffect, useRef } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal } from "react-bootstrap";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import { useNavigate } from "react-router-dom"; // Import useHistory
// import "../style/user.css";
// import PasswordForm from "./passwordForm";
// import EmailForm from "./emailForm";

// const isIPhoneSafari = () => {
//   return (
//     /iP(ad|hone|od)/.test(navigator.platform) &&
//     /Safari/i.test(navigator.userAgent) &&
//     !/CriOS/i.test(navigator.userAgent)
//   );
// };

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
//   const currentVideoRef = useRef(null); // Ref to store the currently playing video
//   const isSafariOnIPhone = isIPhoneSafari(); // Check if the user is on iPhone Safari
//   const [posterImg, setPosterImg] = useState(null);

//   const apiUrl = process.env.REACT_APP_API_URL;
//   useEffect(() => {
//     const fetchGalleryNames = async () => {
//       try {
//         const response = await axios.get(
//           `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
//         );

//         const sortedGalleryNames = response.data.galleryNames.sort((a, b) =>
//           a.localeCompare(b)
//         );
//         setGalleryNames(sortedGalleryNames);
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

//           const { media: projectMedia, posterImg: projectPosterImg } =
//             response.data.projectDetail;

//           // Set poster image
//           setPosterImg(projectPosterImg);

//           // Sort media array based on project name
//           mediaArray.sort((a, b) => {
//             const nameA = (a.project_Name || a.projectName).toLowerCase();
//             const nameB = (b.project_Name || b.projectName).toLowerCase();
//             return nameA.localeCompare(nameB);
//           });

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

//   const handleTabSelect = (tab) => {
//     setSelectedTab(tab);
//   };

//   const handleMediaClick = async (media) => {
//     try {
//       if (currentVideoRef.current) {
//         currentVideoRef.current.pause(); // Pause the currently playing video
//       }
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
//                         className="card-img-top cardImg"
//                         controls
//                         ref={currentVideoRef} // Set the current video ref
//                         playsInline
//                         preload="auto"
//                         poster={
//                           isSafariOnIPhone
//                             ? `${apiUrl}/${posterImg?.filepath}`
//                             : undefined
//                         }
//                       />
//                     ) : (
//                       <img
//                         src={
//                           item.filepath
//                             ? `${apiUrl}/${item.filepath}`
//                             : "path_to_placeholder_image"
//                         }
//                         className="card-img-top cardImg"
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
import VideoPlayer from "./Videoplayer"; // Ensure correct path
import { useNavigate } from "react-router-dom";
import "../style/user.css";
import PasswordForm from "./passwordForm";
import EmailForm from "./emailForm";

const isIPhoneSafari = () => {
  return (
    /iP(ad|hone|od)/.test(navigator.platform) &&
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS/i.test(navigator.userAgent)
  );
};

const Gallery = ({ service_name }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [galleryNames, setGalleryNames] = useState([]);
  const [media, setMedia] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submittedMedia, setSubmittedMedia] = useState(null);
  const [posterImg, setPosterImg] = useState(null);
  const navigate = useNavigate();
  const currentVideoRef = useRef(null);
  const isSafariOnIPhone = isIPhoneSafari();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchGalleryNames = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/gallery_name/gallerynames?service_name=${service_name}`
        );
        const sortedGalleryNames = response.data.galleryNames.sort((a, b) =>
          a.localeCompare(b)
        );
        setGalleryNames(sortedGalleryNames);
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

          const { media: projectMedia, posterImg: projectPosterImg } =
            response.data.projectDetail;

          setPosterImg(projectPosterImg);

          mediaArray.sort((a, b) => {
            const nameA = (a.project_Name || a.projectName).toLowerCase();
            const nameB = (b.project_Name || b.projectName).toLowerCase();
            return nameA.localeCompare(nameB);
          });

          setMedia(mediaArray);
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
        currentVideoRef.current.pause();
      }
      setSelectedMedia(media);
      if (media.isPublic) {
        const formattedProjectName = decodeURIComponent(media.project_Name)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
        navigate(`/service-detail/${formattedProjectName}`);
      } else {
        setModalVisible(true);
        setShowEmailForm(false);
        setSubmittedMedia(media);
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
        setShowEmailForm(false);
        setSubmittedMedia(selectedMedia);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  const handlePasswordSubmit = async (password) => {
    try {
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
    localStorage.removeItem("submittedMedia");
    localStorage.removeItem("emailFormSubmitted");
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
                        className="card-img-top cardImg"
                        controls
                        ref={currentVideoRef}
                        playsInline
                        preload="auto"
                        poster={
                          isSafariOnIPhone
                            ? `${apiUrl}/${posterImg?.filepath.replace(
                                "\\",
                                "/"
                              )}`
                            : undefined
                        }
                      />
                    ) : (
                      <img
                        src={
                          item.filepath
                            ? `${apiUrl}/${item.filepath}`
                            : "path_to_placeholder_image"
                        }
                        className="card-img-top cardImg"
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
