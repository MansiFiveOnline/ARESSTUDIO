import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useParams } from "react-router-dom";
import Lightboxcomponent from "../../components/Lightboxcomponent";
import "../../style/user.css";
import axios from "axios";
import VideoPlayer from "../../components/Videoplayer";
import { Helmet } from "react-helmet";
import Parse from "html-react-parser";

const isIPhoneSafari = () => {
  return (
    /iP(ad|hone|od)/.test(navigator.platform) &&
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS/i.test(navigator.userAgent)
  );
};

const Servicedetail = () => {
  const { project_name } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia("(max-width: 600px)").matches
  );
  const isSafariOnIPhone = isIPhoneSafari(); // Check if the user is on iPhone Safari

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const encodedProjectName = encodeURIComponent(project_name);
        console.log("Encoded Project Name:", encodedProjectName);
        const response = await axios.get(
          `${apiUrl}/api/project/project_details?project_name=${encodedProjectName}`
        );
        setProjectData(response.data.project);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setErrorMessage(
          "No media found for the given service and gallery name."
        );
      }
    };
    fetchProject();

    const handleResize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 600px)").matches);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [project_name]);

  const styles = {
    headerSection: {
      position: isSmallScreen ? "static" : "absolute",
    },
    // imgSection: {
    //   height: isSmallScreen ? "70vh" : "auto",
    //   objectFit: "cover",
    //   filter: "brightness(0.5)",
    // },
    videoSection: {
      // filter: "brightness(0.5)",
    },
    titleSection: {
      fontWeight: "bold",
      display: "none",
    },
  };

  return (
    <Layout style={styles.headerSection}>
      {projectData ? (
        <>
          <Helmet>
            <title>{projectData.project_name} | ARES STUDIO</title>
          </Helmet>

          <div className="project_section position-relative">
            <div className="app">
              <div className="video-list">
                {projectData.media && projectData.media.iframe ? (
                  <VideoPlayer
                    src={projectData.media.iframe}
                    style={styles.videoSection}
                    playsInline
                    preload="auto"
                    poster={
                      isSafariOnIPhone
                        ? `${process.env.REACT_APP_API_URL}/${projectData.posterImg.filepath}`
                        : undefined
                    }
                  />
                ) : projectData._id === "66979a1c154c5f0ba2a6b808" ? (
                  <img
                    src="/images/junkyard-banner.webp"
                    alt="Media"
                    loading="lazy"
                    style={styles.imgSection}
                  />
                ) : projectData._id === "66979a8b154c5f0ba2a6b818" ? (
                  <img
                    src="/images/time-breachers-banner.webp"
                    alt="Media"
                    loading="lazy"
                    style={styles.imgSection}
                  />
                ) : projectData._id === "668518f757c0e49acaeed3f7" ? (
                  <img
                    src="/images/deceit2-banner.webp"
                    alt="Media"
                    loading="lazy"
                    style={styles.imgSection}
                  />
                ) : projectData._id === "6697a15e154c5f0ba2a6b85a" ? (
                  <img
                    src="/images/the-signal-banner.webp"
                    alt="Media"
                    loading="lazy"
                    style={styles.imgSection}
                  />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${projectData.media.filepath}`}
                    alt="Media"
                    loading="lazy"
                    style={styles.imgSection}
                  />
                )}
              </div>
            </div>
            <div className="about_title">
              <h1 style={styles.titleSection}>{projectData.project_name}</h1>
            </div>
            <div className="arrow_down">
              <a href="#gaming_sec">
                <div className="sr-arrow sr-bounce"></div>
              </a>
            </div>
          </div>

          {/* Embark on Epic Adventures section start */}
          <div className="epic_adventures_section pt-5 mt-5" id="gaming_sec">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12 text-center">
                  {projectData.subtitle !== "" && (
                    <h1 className="pb-5">{projectData.subtitle}</h1>
                  )}

                  {projectData.description !== "" && (
                    <div>{Parse(projectData.description)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Embark on Epic Adventures section close */}

          {/* Gallery section start */}
          <section className="mt-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <div className="section_title">
                    <h2 className="pb-3">Gallery</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="no-media-message text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      <section>
        <Lightboxcomponent project_name={project_name} />
      </section>
      {/* Gallery section close */}
    </Layout>
  );
};

export default Servicedetail;
