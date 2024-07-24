import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "./Videoplayer";
import "../style/user.css";

const Lightboxcomponent = () => {
  const { project_name } = useParams();
  const [media, setMedia] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef(null); // Ref for the modal element
  const carouselRef = useRef(null); // Ref for the carousel element
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProjectMedia = async () => {
      try {
        const encodedProjectName = encodeURIComponent(project_name);
        const response = await axios.get(
          `${apiUrl}/api/project_detail/project_media/?project_name=${encodedProjectName}`
        );
        // setMedia(response.data.media);
        // Sort the media based on the sequence
        const sortedMedia = response.data.media.sort(
          (a, b) => a.sequence - b.sequence
        );
        console.log(sortedMedia);
        setMedia(sortedMedia);
      } catch (error) {
        console.error("Error fetching project media:", error);
        setErrorMessage("Error fetching project media.");
      }
    };

    fetchProjectMedia();
    const handleResize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 600px)").matches);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [project_name]);

  const stopAllVideos = () => {
    const iframes = modalRef.current.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      const iframeSrc = iframe.src;
      iframe.src = ""; // Clear the src to stop video playback
      iframe.src = iframeSrc; // Restore the src
    });
  };

  useEffect(() => {
    const handleModalClose = () => {
      stopAllVideos();
    };

    const handleSlideChange = () => {
      stopAllVideos();
      const carouselItems =
        carouselRef.current.querySelectorAll(".carousel-item");
      const activeItem = carouselItems[activeIndex];
      const activeIframe = activeItem.querySelector("iframe");
      if (activeIframe) {
        activeIframe.src = activeIframe.src; // Restart the src to start playing the active iframe
      }
    };

    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
    }

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener("slide.bs.carousel", handleSlideChange);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
      }
      if (carouselElement) {
        carouselElement.removeEventListener(
          "slide.bs.carousel",
          handleSlideChange
        );
      }
    };
  }, [activeIndex]);

  const handleImageClick = (index) => {
    setActiveIndex(index); // Set the active index to the clicked image
    const carousel = new window.bootstrap.Carousel(carouselRef.current);
    carousel.to(index); // Move to the active slide
  };

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
                  data-bs-toggle="modal"
                  data-bs-target="#exampleLightbox"
                  onClick={() => handleImageClick(index)}
                  className="col-sm-4"
                >
                  <div className="gal-box">
                    {item.iframe ? (
                      isSmallScreen ? (
                        <video
                          className="card-img-top w-100"
                          src={item.iframe}
                          type="video/mp4"
                          controls
                        />
                      ) : (
                        <VideoPlayer
                          src={item.iframe}
                          type="video/mp4"
                          className="card-img-top w-100"
                          controls
                        />
                      )
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

      <div
        className="modal fade"
        id="exampleLightbox"
        tabIndex="-1"
        aria-labelledby="exampleLightboxLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                id="lightboxExampleCarousel"
                className="carousel slide"
                ref={carouselRef}
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
                        <iframe
                          src={item.iframe}
                          title={`Media ${index}`}
                          allowFullScreen
                          className="img-fluid mh-100"
                        />
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
    </div>
  );
};

export default Lightboxcomponent;
