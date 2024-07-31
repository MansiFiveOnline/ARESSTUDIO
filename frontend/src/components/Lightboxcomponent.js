// import React, { useEffect, useState, useRef } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const modalRef = useRef(null); // Ref for the modal element
//   const carouselRef = useRef(null); // Ref for the carousel element
//   const [isSmallScreen, setIsSmallScreen] = useState(
//     window.matchMedia("(max-width: 600px)").matches
//   );

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         // setMedia(response.data.media);
//         // Sort the media based on the sequence
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         console.log(sortedMedia);
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//     // const handleResize = () => {
//     //   setIsSmallScreen(window.matchMedia("(max-width: 600px)").matches);
//     // };
//     // window.addEventListener("resize", handleResize);
//     // return () => window.removeEventListener("resize", handleResize);
//   }, [project_name]);

//   const stopAllVideos = () => {
//     const iframes = modalRef.current.querySelectorAll("iframe");
//     iframes.forEach((iframe) => {
//       const iframeSrc = iframe.src;
//       iframe.src = ""; // Clear the src to stop video playback
//       iframe.src = iframeSrc; // Restore the src
//     });
//   };

//   useEffect(() => {
//     const handleModalClose = () => {
//       stopAllVideos();
//     };

//     const handleSlideChange = () => {
//       stopAllVideos();
//       const carouselItems =
//         carouselRef.current.querySelectorAll(".carousel-item");
//       const activeItem = carouselItems[activeIndex];
//       const activeIframe = activeItem.querySelector("iframe");
//       if (activeIframe) {
//         activeIframe.src = activeIframe.src; // Restart the src to start playing the active iframe
//       }
//     };

//     const modalElement = modalRef.current;
//     if (modalElement) {
//       modalElement.addEventListener("hidden.bs.modal", handleModalClose);
//     }

//     const carouselElement = carouselRef.current;
//     if (carouselElement) {
//       carouselElement.addEventListener("slide.bs.carousel", handleSlideChange);
//     }

//     return () => {
//       if (modalElement) {
//         modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
//       }
//       if (carouselElement) {
//         carouselElement.removeEventListener(
//           "slide.bs.carousel",
//           handleSlideChange
//         );
//       }
//     };
//   }, [activeIndex]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index); // Set the active index to the clicked image
//     const carousel = new window.bootstrap.Carousel(carouselRef.current);
//     carousel.to(index); // Move to the active slide
//   };

//   const styles = {
//     // videoBorder: {
//     //   border: "0.5px solid white",
//     // },
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   data-bs-toggle="modal"
//                   data-bs-target="#exampleLightbox"
//                   onClick={() => handleImageClick(index)}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       // isSmallScreen ? (
//                       //   <video
//                       //     className="card-img-top w-100"
//                       //     src={item.iframe}
//                       //     type="video/mp4"
//                       //     controls
//                       //   />
//                       // ) : (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                         style={styles.videoBorder}
//                       />
//                     ) : (
//                       // )
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className="modal fade"
//         id="exampleLightbox"
//         tabIndex="-1"
//         aria-labelledby="exampleLightboxLabel"
//         aria-hidden="true"
//         ref={modalRef}
//       >
//         <div className="modal-dialog modal-xl modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div
//                 id="lightboxExampleCarousel"
//                 className="carousel slide"
//                 ref={carouselRef}
//               >
//                 <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                   {media.map((item, index) => (
//                     <div
//                       key={index}
//                       className={`carousel-item text-center ${
//                         index === activeIndex ? "active" : ""
//                       }`}
//                     >
//                       {item.iframe ? (
//                         <iframe
//                           src={item.iframe}
//                           title={`Media ${index}`}
//                           allowFullScreen
//                           className="img-fluid mh-100"
//                         />
//                       ) : (
//                         <img
//                           src={`${apiUrl}/${item.filepath}`}
//                           alt={`Media ${index}`}
//                           className="img-fluid mh-100"
//                           loading="lazy"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="carousel-control-prev"
//                   type="button"
//                   data-bs-target="#lightboxExampleCarousel"
//                   data-bs-slide="prev"
//                 >
//                   <span
//                     className="carousel-control-prev-icon"
//                     aria-hidden="true"
//                   ></span>
//                   <span className="visually-hidden">Previous</span>
//                 </button>
//                 <button
//                   className="carousel-control-next"
//                   type="button"
//                   data-bs-target="#lightboxExampleCarousel"
//                   data-bs-slide="next"
//                 >
//                   <span
//                     className="carousel-control-next-icon"
//                     aria-hidden="true"
//                   ></span>
//                   <span className="visually-hidden">Next</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lightboxcomponent;
// import React, { useEffect, useState, useRef } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const modalRef = useRef(null);
//   const carouselRef = useRef(null);
//   const listenersAdded = useRef(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   useEffect(() => {
//     if (modalRef.current) {
//       const handleModalShow = () => {
//         console.log("Modal shown");
//         const iframes = modalRef.current.querySelectorAll("iframe");
//         iframes.forEach((iframe) => {
//           iframe.src = iframe.getAttribute("data-src"); // Reset iframe src
//         });

//         const videos = modalRef.current.querySelectorAll("video");
//         videos.forEach((video) => {
//           video.play(); // Play video
//         });
//       };

//       const handleModalHide = () => {
//         console.log("Modal hidden");
//         const iframes = modalRef.current.querySelectorAll("iframe");
//         iframes.forEach((iframe) => {
//           iframe.src = ""; // Stop iframe video playback
//         });

//         const videos = modalRef.current.querySelectorAll("video");
//         videos.forEach((video) => {
//           video.pause(); // Pause video playback
//           video.currentTime = 0; // Reset video playback
//         });
//       };

//       if (!listenersAdded.current) {
//         console.log("Adding modal event listeners");
//         modalRef.current.addEventListener("shown.bs.modal", handleModalShow);
//         modalRef.current.addEventListener("hidden.bs.modal", handleModalHide);
//         listenersAdded.current = true;
//       }

//       return () => {
//         if (listenersAdded.current) {
//           console.log("Removing modal event listeners");
//           modalRef.current.removeEventListener(
//             "shown.bs.modal",
//             handleModalShow
//           );
//           modalRef.current.removeEventListener(
//             "hidden.bs.modal",
//             handleModalHide
//           );
//           listenersAdded.current = false;
//         }
//       };
//     }
//   }, []);

//   useEffect(() => {
//     if (carouselRef.current) {
//       console.log("Initializing carousel");
//       const carousel = new window.bootstrap.Carousel(carouselRef.current);
//       carousel.to(activeIndex);
//     }
//   }, [activeIndex]);

//   const handleImageClick = (index) => {
//     console.log(`Image clicked: ${index}`);
//     setActiveIndex(index);
//     const carousel = new window.bootstrap.Carousel(carouselRef.current);
//     carousel.to(index);
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   data-bs-toggle="modal"
//                   data-bs-target="#exampleLightbox"
//                   onClick={(e) => {
//                     e.preventDefault(); // Prevent default link behavior
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className="modal fade"
//         id="exampleLightbox"
//         tabIndex="-1"
//         aria-labelledby="exampleLightboxLabel"
//         aria-hidden="true"
//         ref={modalRef}
//       >
//         <div className="modal-dialog modal-xl modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div
//                 id="lightboxExampleCarousel"
//                 className="carousel slide"
//                 ref={carouselRef}
//               >
//                 <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                   {media.map((item, index) => (
//                     <div
//                       key={index}
//                       className={`carousel-item text-center ${
//                         index === activeIndex ? "active" : ""
//                       }`}
//                     >
//                       {item.iframe ? (
//                         <iframe
//                           src={index === activeIndex ? item.iframe : ""}
//                           data-src={item.iframe} // Store the original src
//                           title={`Media ${index}`}
//                           allowFullScreen
//                           className="img-fluid mh-100"
//                         />
//                       ) : (
//                         <img
//                           src={`${apiUrl}/${item.filepath}`}
//                           alt={`Media ${index}`}
//                           className="img-fluid mh-100"
//                           loading="lazy"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="carousel-control-prev"
//                   type="button"
//                   data-bs-target="#lightboxExampleCarousel"
//                   data-bs-slide="prev"
//                 >
//                   <span
//                     className="carousel-control-prev-icon"
//                     aria-hidden="true"
//                   ></span>
//                   <span className="visually-hidden">Previous</span>
//                 </button>
//                 <button
//                   className="carousel-control-next"
//                   type="button"
//                   data-bs-target="#lightboxExampleCarousel"
//                   data-bs-slide="next"
//                 >
//                   <span
//                     className="carousel-control-next-icon"
//                     aria-hidden="true"
//                   ></span>
//                   <span className="visually-hidden">Next</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   useEffect(() => {
//     if (modalVisible) {
//       const carouselElement = document.getElementById(
//         "lightboxExampleCarousel"
//       );
//       if (carouselElement) {
//         const carousel = new window.bootstrap.Carousel(carouselElement);
//         carousel.to(activeIndex);
//       }
//     }
//   }, [activeIndex, modalVisible]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true); // Show modal when an image is clicked
//   };

//   const handleModalClose = () => {
//     setModalVisible(false); // Hide modal
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <div
//           className="modal fade show d-block"
//           id="exampleLightbox"
//           tabIndex="-1"
//           aria-labelledby="exampleLightboxLabel"
//           aria-hidden="true"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               handleModalClose(); // Close modal when clicking outside
//             }
//           }}
//         >
//           <div className="modal-dialog modal-xl modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleModalClose}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div id="lightboxExampleCarousel" className="carousel slide">
//                   <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                     {media.map((item, index) => (
//                       <div
//                         key={index}
//                         className={`carousel-item text-center ${
//                           index === activeIndex ? "active" : ""
//                         }`}
//                       >
//                         {item.iframe ? (
//                           <iframe
//                             src={index === activeIndex ? item.iframe : ""}
//                             data-src={item.iframe}
//                             title={`Media ${index}`}
//                             allowFullScreen
//                             className="img-fluid mh-100"
//                           />
//                         ) : (
//                           <img
//                             src={`${apiUrl}/${item.filepath}`}
//                             alt={`Media ${index}`}
//                             className="img-fluid mh-100"
//                             loading="lazy"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="carousel-control-prev"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="prev"
//                   >
//                     <span
//                       className="carousel-control-prev-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Previous</span>
//                   </button>
//                   <button
//                     className="carousel-control-next"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="next"
//                   >
//                     <span
//                       className="carousel-control-next-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Next</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <div
//           className="modal fade show d-block"
//           id="exampleLightbox"
//           tabIndex="-1"
//           aria-labelledby="exampleLightboxLabel"
//           aria-hidden="true"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               handleModalClose();
//             }
//           }}
//         >
//           <div className="modal-dialog modal-xl modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleModalClose}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div id="lightboxExampleCarousel" className="carousel slide">
//                   <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                     {media.map((item, index) => (
//                       <div
//                         key={index}
//                         className={`carousel-item text-center ${
//                           index === activeIndex ? "active" : ""
//                         }`}
//                       >
//                         {item.iframe ? (
//                           <div className="embed-responsive embed-responsive-16by9">
//                             <iframe
//                               src={item.iframe}
//                               title={`Media ${index}`}
//                               allowFullScreen
//                               className="embed-responsive-item"
//                             />
//                           </div>
//                         ) : (
//                           <img
//                             src={`${apiUrl}/${item.filepath}`}
//                             alt={`Media ${index}`}
//                             className="img-fluid mh-100"
//                             loading="lazy"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="carousel-control-prev"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="prev"
//                   >
//                     <span
//                       className="carousel-control-prev-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Previous</span>
//                   </button>
//                   <button
//                     className="carousel-control-next"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="next"
//                   >
//                     <span
//                       className="carousel-control-next-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Next</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <div
//           className="modal fade show d-block"
//           id="exampleLightbox"
//           tabIndex="-1"
//           aria-labelledby="exampleLightboxLabel"
//           aria-hidden="true"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               handleModalClose();
//             }
//           }}
//         >
//           <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleModalClose}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div id="lightboxExampleCarousel" className="carousel slide">
//                   <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                     {media.map((item, index) => (
//                       <div
//                         key={index}
//                         className={`carousel-item text-center ${
//                           index === activeIndex ? "active" : ""
//                         }`}
//                       >
//                         {item.iframe ? (
//                           <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                             {index === activeIndex && (
//                               <iframe
//                                 src={item.iframe}
//                                 title={`Media ${index}`}
//                                 allowFullScreen
//                                 className="embed-responsive-item"
//                               />
//                             )}
//                           </div>
//                         ) : (
//                           <img
//                             src={`${apiUrl}/${item.filepath}`}
//                             alt={`Media ${index}`}
//                             className="img-fluid mh-100"
//                             loading="lazy"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="carousel-control-prev"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="prev"
//                     onClick={() => handleCarouselControl("prev")}
//                   >
//                     <span
//                       className="carousel-control-prev-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Previous</span>
//                   </button>
//                   <button
//                     className="carousel-control-next"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="next"
//                     onClick={() => handleCarouselControl("next")}
//                   >
//                     <span
//                       className="carousel-control-next-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Next</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   useEffect(() => {
//     if (modalVisible) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     // Cleanup function to ensure the class is removed if the component unmounts
//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [modalVisible]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <div
//           className="modal fade show d-block"
//           id="exampleLightbox"
//           tabIndex="-1"
//           aria-labelledby="exampleLightboxLabel"
//           aria-hidden="true"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               handleModalClose();
//             }
//           }}
//         >
//           <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleModalClose}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div id="lightboxExampleCarousel" className="carousel slide">
//                   <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                     {media.map((item, index) => (
//                       <div
//                         key={index}
//                         className={`carousel-item text-center ${
//                           index === activeIndex ? "active" : ""
//                         }`}
//                       >
//                         {item.iframe ? (
//                           <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                             {index === activeIndex && (
//                               <iframe
//                                 src={item.iframe}
//                                 title={`Media ${index}`}
//                                 allowFullScreen
//                                 className="embed-responsive-item"
//                               />
//                             )}
//                           </div>
//                         ) : (
//                           <img
//                             src={`${apiUrl}/${item.filepath}`}
//                             alt={`Media ${index}`}
//                             className="img-fluid mh-100"
//                             loading="lazy"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     className="carousel-control-prev"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="prev"
//                     onClick={() => handleCarouselControl("prev")}
//                   >
//                     <span
//                       className="carousel-control-prev-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Previous</span>
//                   </button>
//                   <button
//                     className="carousel-control-next"
//                     type="button"
//                     data-bs-target="#lightboxExampleCarousel"
//                     data-bs-slide="next"
//                     onClick={() => handleCarouselControl("next")}
//                   >
//                     <span
//                       className="carousel-control-next-icon"
//                       aria-hidden="true"
//                     ></span>
//                     <span className="visually-hidden">Next</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   useEffect(() => {
//     if (modalVisible) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     // Cleanup function to ensure the class is removed if the component unmounts
//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [modalVisible]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         type="video/mp4"
//                         className="card-img-top w-100"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <>
//           <div className="modal-overlay" onClick={handleModalClose}></div>
//           <div
//             className="modal fade show d-block"
//             id="exampleLightbox"
//             tabIndex="-1"
//             aria-labelledby="exampleLightboxLabel"
//             aria-hidden="true"
//             onClick={(e) => {
//               if (e.target === e.currentTarget) {
//                 handleModalClose();
//               }
//             }}
//           >
//             <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleModalClose}
//                     aria-label="Close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div id="lightboxExampleCarousel" className="carousel slide">
//                     <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                       {media.map((item, index) => (
//                         <div
//                           key={index}
//                           className={`carousel-item text-center ${
//                             index === activeIndex ? "active" : ""
//                           }`}
//                         >
//                           {item.iframe ? (
//                             <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                               {index === activeIndex && (
//                                 <iframe
//                                   src={item.iframe}
//                                   title={`Media ${index}`}
//                                   allowFullScreen
//                                   className="embed-responsive-item"
//                                 />
//                               )}
//                             </div>
//                           ) : (
//                             <img
//                               src={`${apiUrl}/${item.filepath}`}
//                               alt={`Media ${index}`}
//                               className="img-fluid mh-100"
//                               loading="lazy"
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <button
//                       className="carousel-control-prev"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="prev"
//                       onClick={() => handleCarouselControl("prev")}
//                     >
//                       <span
//                         className="carousel-control-prev-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Previous</span>
//                     </button>
//                     <button
//                       className="carousel-control-next"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="next"
//                       onClick={() => handleCarouselControl("next")}
//                     >
//                       <span
//                         className="carousel-control-next-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Next</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//         setErrorMessage("Error fetching project media.");
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name]);

//   useEffect(() => {
//     if (modalVisible) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [modalVisible]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         className="card-img-top w-100"
//                         controls
//                         startTime={10}
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <>
//           <div className="modal-overlay" onClick={handleModalClose}></div>
//           <div
//             className="modal fade show d-block"
//             id="exampleLightbox"
//             tabIndex="-1"
//             aria-labelledby="exampleLightboxLabel"
//             aria-hidden="true"
//             onClick={(e) => {
//               if (e.target === e.currentTarget) {
//                 handleModalClose();
//               }
//             }}
//           >
//             <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleModalClose}
//                     aria-label="Close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div id="lightboxExampleCarousel" className="carousel slide">
//                     <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                       {media.map((item, index) => (
//                         <div
//                           key={index}
//                           className={`carousel-item text-center ${
//                             index === activeIndex ? "active" : ""
//                           }`}
//                         >
//                           <div className="video-container">
//                             {item.iframe ? (
//                               <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                                 {index === activeIndex && (
//                                   <video
//                                     src={item.iframe}
//                                     title={`Media ${index}`}
//                                     allowFullScreen
//                                     className="embed-responsive-item"
//                                     controls
//                                   />
//                                 )}
//                               </div>
//                             ) : (
//                               <img
//                                 src={`${apiUrl}/${item.filepath}`}
//                                 alt={`Media ${index}`}
//                                 className="img-fluid mh-100"
//                                 loading="lazy"
//                               />
//                             )}
//                             <button
//                               className="carousel-control-prev"
//                               type="button"
//                               data-bs-target="#lightboxExampleCarousel"
//                               data-bs-slide="prev"
//                               onClick={() => handleCarouselControl("prev")}
//                             >
//                               <span
//                                 className="carousel-control-prev-icon"
//                                 aria-hidden="true"
//                               ></span>
//                               <span className="visually-hidden">Previous</span>
//                             </button>
//                             <button
//                               className="carousel-control-next"
//                               type="button"
//                               data-bs-target="#lightboxExampleCarousel"
//                               data-bs-slide="next"
//                               onClick={() => handleCarouselControl("next")}
//                             >
//                               <span
//                                 className="carousel-control-next-icon"
//                                 aria-hidden="true"
//                               ></span>
//                               <span className="visually-hidden">Next</span>
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   const debounce = (func, wait) => {
//     let timeout;
//     return function (...args) {
//       const context = this;
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func.apply(context, args), wait);
//     };
//   };

//   // Use requestAnimationFrame to batch updates
//   const handleResize = debounce(() => {
//     window.requestAnimationFrame(() => {
//       window.dispatchEvent(new Event("resize"));
//     });
//   }, 200);

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name, apiUrl]);

//   useEffect(() => {
//     if (modalVisible) {
//       document.body.classList.add("no-scroll");
//       handleResize();
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [modalVisible]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         className="card-img-top w-100"
//                         controls
//                         startTime={10}
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <>
//           <div className="modal-overlay" onClick={handleModalClose}></div>
//           <div
//             className="modal fade show d-block"
//             id="exampleLightbox"
//             tabIndex="-1"
//             aria-labelledby="exampleLightboxLabel"
//             aria-hidden="true"
//             onClick={(e) => {
//               if (e.target === e.currentTarget) {
//                 handleModalClose();
//               }
//             }}
//           >
//             <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleModalClose}
//                     aria-label="Close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div id="lightboxExampleCarousel" className="carousel slide">
//                     <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                       {media.map((item, index) => (
//                         <div
//                           key={index}
//                           className={`carousel-item text-center ${
//                             index === activeIndex ? "active" : ""
//                           }`}
//                         >
//                           {item.iframe ? (
//                             <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                               {index === activeIndex && (
//                                 <video
//                                   src={item.iframe}
//                                   title={`Media ${index}`}
//                                   allowFullScreen
//                                   className="embed-responsive-item"
//                                   controls
//                                 />
//                               )}
//                             </div>
//                           ) : (
//                             <img
//                               src={`${apiUrl}/${item.filepath}`}
//                               alt={`Media ${index}`}
//                               className="img-fluid mh-100"
//                               loading="lazy"
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <button
//                       className="carousel-control-prev"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="prev"
//                       onClick={() => handleCarouselControl("prev")}
//                     >
//                       <span
//                         className="carousel-control-prev-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Previous</span>
//                     </button>
//                     <button
//                       className="carousel-control-next"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="next"
//                       onClick={() => handleCarouselControl("next")}
//                     >
//                       <span
//                         className="carousel-control-next-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Next</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import VideoPlayer from "./Videoplayer";
// import "../style/user.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Lightboxcomponent = () => {
//   const { project_name } = useParams();
//   const [media, setMedia] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchProjectMedia = async () => {
//       try {
//         const encodedProjectName = encodeURIComponent(project_name);
//         const response = await axios.get(
//           `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
//         );
//         const sortedMedia = response.data.media.sort(
//           (a, b) => a.sequence - b.sequence
//         );
//         setMedia(sortedMedia);
//       } catch (error) {
//         console.error("Error fetching project media:", error);
//       }
//     };

//     fetchProjectMedia();
//   }, [project_name, apiUrl]);

//   const handleImageClick = (index) => {
//     setActiveIndex(index);
//     setModalVisible(true);
//   };

//   const handleModalClose = () => {
//     setModalVisible(false);
//   };

//   const handleCarouselControl = (direction) => {
//     setActiveIndex((prevIndex) => {
//       const newIndex =
//         direction === "next"
//           ? (prevIndex + 1) % media.length
//           : (prevIndex - 1 + media.length) % media.length;
//       return newIndex;
//     });
//   };

//   useEffect(() => {
//     if (modalVisible) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }

//     return () => {
//       document.body.classList.remove("no-scroll");
//     };
//   }, [modalVisible]);

//   return (
//     <div className="lightbox_gallery">
//       <div className="container text-center py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-12">
//             <div className="row justify-content-center">
//               {media.map((item, index) => (
//                 <Link
//                   to="#"
//                   key={index}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleImageClick(index);
//                   }}
//                   className="col-sm-4"
//                 >
//                   <div className="gal-box">
//                     {item.iframe ? (
//                       <VideoPlayer
//                         src={item.iframe}
//                         className="card-img-top w-100"
//                         controls
//                         startTime={10}
//                       />
//                     ) : (
//                       <img
//                         src={`${apiUrl}/${item.filepath}`}
//                         alt={`${item.filename}`}
//                         className="card-img-top"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalVisible && (
//         <>
//           <div className="modal-overlay" onClick={handleModalClose}></div>
//           <div
//             className="modal fade show d-block"
//             id="exampleLightbox"
//             tabIndex="-1"
//             aria-labelledby="exampleLightboxLabel"
//             aria-hidden="true"
//             onClick={(e) => {
//               if (e.target === e.currentTarget) {
//                 handleModalClose();
//               }
//             }}
//           >
//             <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleModalClose}
//                     aria-label="Close"
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <div
//                     id="lightboxExampleCarousel"
//                     className="carousel slide"
//                     data-bs-ride="carousel"
//                   >
//                     <div className="carousel-inner ratio ratio-16x9 bg-dark">
//                       {media.map((item, index) => (
//                         <div
//                           key={index}
//                           className={`carousel-item text-center ${
//                             index === activeIndex ? "active" : ""
//                           }`}
//                         >
//                           {item.iframe ? (
//                             <div className="embed-responsive embed-responsive-16by9 bg-dark">
//                               {index === activeIndex && (
//                                 <video
//                                   src={item.iframe}
//                                   title={`Media ${index}`}
//                                   allowFullScreen
//                                   className="embed-responsive-item"
//                                   controls
//                                 />
//                               )}
//                             </div>
//                           ) : (
//                             <img
//                               src={`${apiUrl}/${item.filepath}`}
//                               alt={`Media ${index}`}
//                               className="img-fluid mh-100"
//                               loading="lazy"
//                             />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <button
//                       className="carousel-control-prev"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="prev"
//                       onClick={() => handleCarouselControl("prev")}
//                     >
//                       <span
//                         className="carousel-control-prev-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Previous</span>
//                     </button>
//                     <button
//                       className="carousel-control-next"
//                       type="button"
//                       data-bs-target="#lightboxExampleCarousel"
//                       data-bs-slide="next"
//                       onClick={() => handleCarouselControl("next")}
//                     >
//                       <span
//                         className="carousel-control-next-icon"
//                         aria-hidden="true"
//                       ></span>
//                       <span className="visually-hidden">Next</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Lightboxcomponent;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "./Videoplayer";
import "../style/user.css"; // Ensure your styles are here
import "bootstrap/dist/css/bootstrap.min.css";

const Lightboxcomponent = () => {
  const { project_name } = useParams();
  const [media, setMedia] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProjectMedia = async () => {
      try {
        const encodedProjectName = encodeURIComponent(project_name);
        const response = await axios.get(
          `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
        );
        const sortedMedia = response.data.media.sort(
          (a, b) => a.sequence - b.sequence
        );
        setMedia(sortedMedia);
      } catch (error) {
        console.error("Error fetching project media:", error);
      }
    };

    fetchProjectMedia();
  }, [project_name, apiUrl]);

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCarouselControl = (direction) => {
    setActiveIndex((prevIndex) => {
      const newIndex =
        direction === "next"
          ? (prevIndex + 1) % media.length
          : (prevIndex - 1 + media.length) % media.length;
      return newIndex;
    });
  };

  useEffect(() => {
    if (modalVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [modalVisible]);

  return (
    <div className="lightbox_gallery">
      <div className="container text-center py-5">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="row justify-content-center">
              {media.map((item, index) => (
                <Link
                  to="#"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick(index);
                  }}
                  className="col-sm-4"
                >
                  <div className="gal-box">
                    {item.iframe ? (
                      <VideoPlayer
                        src={item.iframe}
                        className="card-img-top w-100"
                        controls
                        startTime={10}
                      />
                    ) : (
                      <img
                        src={`${apiUrl}/${item.filepath}`}
                        alt={`${item.filename}`}
                        className="card-img-top"
                        loading="lazy"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <>
          <div className="modal-overlay" onClick={handleModalClose}></div>
          <div
            className="modal fade show d-block"
            id="exampleLightbox"
            tabIndex="-1"
            aria-labelledby="exampleLightboxLabel"
            aria-hidden="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleModalClose();
              }
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered bg-dark">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div
                    id="lightboxExampleCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner ratio ratio-16x9 bg-dark">
                      {media.map((item, index) => (
                        <div
                          key={index}
                          className={`carousel-item text-center ${
                            index === activeIndex ? "active" : ""
                          }`}
                        >
                          {item.iframe ? (
                            <div className="embed-responsive embed-responsive-16by9 bg-dark">
                              {index === activeIndex && (
                                <video
                                  src={item.iframe}
                                  title={`Media ${index}`}
                                  allowFullScreen
                                  className="embed-responsive-item"
                                  controls
                                  preload="none"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          ) : (
                            <img
                              src={`${apiUrl}/${item.filepath}`}
                              alt={`Media ${index}`}
                              className="img-fluid mh-100"
                              loading="lazy"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#lightboxExampleCarousel"
                      data-bs-slide="prev"
                      onClick={() => handleCarouselControl("prev")}
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#lightboxExampleCarousel"
                      data-bs-slide="next"
                      onClick={() => handleCarouselControl("next")}
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Lightboxcomponent;
