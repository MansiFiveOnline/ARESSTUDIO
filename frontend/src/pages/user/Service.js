import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import VideoPlayer from "../../components/Videoplayer";
import { useParams } from "react-router-dom"; // Import useParams
import Gallery from "../../components/Gallery";
import axios from "axios";
import "../../style/user.css";
import { Helmet } from "react-helmet";
import Parse from "html-react-parser";

const isIPhoneSafari = () => {
  return (
    /iP(ad|hone|od)/.test(navigator.platform) &&
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS/i.test(navigator.userAgent)
  );
};

const Service = () => {
  // Access service name parameter from URL
  const { service_name } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [metaData, setMetaData] = useState({
    metaTitle: "",
    metaDescription: "",
  });
  // const serviceName = service_name.toUpperCase();
  const serviceName = service_name ? service_name.toUpperCase() : "";
  const isSafariOnIPhone = isIPhoneSafari(); // Check if the user is on iPhone Safari

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        console.log("formattedServiceName", serviceName);

        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(
          `${apiUrl}/api/service/servicename?service_name=${serviceName}`
        );
        setServiceData(response.data.service);
        if (
          response.data.service.media &&
          response.data.service.media.length < 0
        ) {
          console.log(response.data.service.media[0].filename);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        setErrorMessage(
          "No media found for the given service and gallery name."
        );
      }
    };

    if (service_name) {
      fetchServiceData();
    }
  }, [service_name]);

  return (
    <Layout>
      {serviceData && (
        <Helmet>
          <title>{serviceData.metaTitle}</title>
          <meta name="title" content={serviceData.metaTitle} />
          <meta name="description" content={serviceData.metaDescription} />
          {/* Add other meta tags as needed */}
        </Helmet>
      )}
      {serviceData ? (
        <>
          <div className="service_section position-relative">
            <div className="app">
              <div className="video-list">
                {/* <VideoPlayer src="images/video2.mp4" /> */}
                {/* <img src={serviceData.media} alt="Media" /> */}
                {serviceData.media && serviceData.media.iframe ? (
                  <VideoPlayer
                    src={serviceData.media.iframe}
                    playsInline
                    preload="auto"
                    poster={
                      isSafariOnIPhone
                        ? `${process.env.REACT_APP_API_URL}/${serviceData.posterImg.filepath}`
                        : undefined
                    }
                  />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${serviceData.media.filepath}`}
                    alt="Media"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
            <div className="service_title">
              <h1>{service_name}</h1> {/* Display service name dynamically */}
            </div>
            <div className="arrow_down">
              <a href="#gaming">
                <div className="sr-arrow sr-bounce"></div>
              </a>
            </div>
          </div>

          <div
            className="epic_adventures_section pt-5 mt-5 service-page"
            id="gaming"
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12 text-center">
                  <h2 className="pb-5">
                    <strong>{serviceData.title}</strong>
                    <br />
                    {serviceData.subtitle}
                  </h2>
                  <p>{Parse(serviceData.description)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-media-message text-center">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* gallery section section start */}

      <section>
        <div className="service">
          <Gallery service_name={serviceName} />
        </div>
      </section>
      {/* // {/* gallery section section close */}
    </Layout>
  );
};

export default Service;
