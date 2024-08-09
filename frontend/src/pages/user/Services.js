import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { Link } from "react-router-dom";
import VideoPlayer from "../../components/Videoplayer";
import axios from "axios";
import "../../style/user.css";
import { Helmet } from "react-helmet";

const isIPhoneSafari = () => {
  return (
    /iP(ad|hone|od)/.test(navigator.platform) &&
    /Safari/i.test(navigator.userAgent) &&
    !/CriOS/i.test(navigator.userAgent)
  );
};

const Services = () => {
  const [gamesData, setGamesData] = useState(null);
  const [vfxData, setVfxData] = useState(null);
  const isSafariOnIPhone = isIPhoneSafari(); // Check if the user is on iPhone Safari

  console.log("api", `${process.env.REACT_APP_API_URL}`);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .get(`${apiUrl}/api/test-cors`)
      .then((response) => console.log(response.data))
      .catch((error) => console.error("CORS test failed:", error));

    const fetchServicesData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const gamesResponse = await axios.get(
          `${apiUrl}/api/service/servicename?service_name=GAMES`
        );
        const vfxResponse = await axios.get(
          `${apiUrl}/api/service/servicename?service_name=VFX`
        );
        setGamesData(gamesResponse.data.service);
        setVfxData(vfxResponse.data.service);
        console.log("api url", apiUrl);
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    };

    fetchServicesData();
  }, []);

  const styles = {
    homeBanner: {
      lineHeight: "0",
    },
  };

  return (
    <>
      <Helmet>
        <title>Service | ARES STUDIO</title>
      </Helmet>

      <>
        <Header />
        <div className="home_banner" style={styles.homeBanner}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <div className="video_box position-relative">
                  <Link to="/service/games">
                    {" "}
                    {/* Pass service name as parameter */}
                    <div className="app">
                      <div className="video-list">
                        {gamesData &&
                        gamesData.media &&
                        gamesData.media.iframe ? (
                          <VideoPlayer
                            src={gamesData.media.iframe}
                            preload="auto"
                            poster={
                              isSafariOnIPhone
                                ? "./images/games-img.png"
                                : undefined
                            } // Conditionally apply the poster
                          />
                        ) : gamesData &&
                          gamesData.media &&
                          gamesData.media.filepath ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${gamesData.media.filepath}`}
                            alt="Games Media"
                            loading="lazy"
                          />
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                    <div className="video_title">
                      <div className="text-center">
                        <h1>GAMES</h1>
                        <Link to="/service/games" className="btn-link">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="video_box position-relative">
                  <Link to="/service/vfx">
                    {" "}
                    {/* Pass service name as parameter */}
                    <div className="app">
                      <div className="video-list">
                        {vfxData && vfxData.media && vfxData.media.iframe ? (
                          <VideoPlayer src={vfxData.media.iframe} />
                        ) : vfxData &&
                          vfxData.media &&
                          vfxData.media.filepath ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${vfxData.media.filepath}`}
                            alt="VFX Media"
                            loading="lazy"
                          />
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                    <div className="video_title">
                      <div className="text-center">
                        <h1>VFX</h1>
                        <Link to="/service/vfx" className="btn-link">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        s
      </>
    </>
  );
};

export default Services;
