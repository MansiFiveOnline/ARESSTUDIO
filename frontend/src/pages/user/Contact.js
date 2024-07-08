import React, { useState } from "react";
import Layout from "../../components/layout";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import "../../style/user.css";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Contact() {
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.post(`${apiUrl}/api/contact`, formData);
      // setStatusMessage(response.data.message);
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrorMessage("Some error occurred in form submission. Try again!");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact | ARES STUDIO</title>
      </Helmet>
      {/* Header banner section start */}
      <div className="service_section position-relative">
        <div className="app">
          <div className="video-list">
            {/* <VideoPlayer src="images/video2.mp4" /> */}
            <img
              src="images/service-detail.jpg"
              alt="banner img"
              loading="lazy"
            />
          </div>
        </div>
        <div className="service_title">
          <h1>
            REACH OUT &
            <br />
            LET'S CREATE EXTRAORDINARY
          </h1>
        </div>
        <div className="arrow_down">
          <a href="#getintouch">
            <div className="sr-arrow sr-bounce"></div>
          </a>
        </div>
      </div>
      {/* Header banner section start */}

      {/* get in touch form section start */}
      <section className="getin_section" id="getintouch">
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
                          onChange={handleInputChange}
                          placeholder="Name*"
                          required
                        />
                        {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
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
                    <div className="col-lg-12">
                      <div className="mb-5">
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Subject"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-5">
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Message"
                          required
                        ></textarea>
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
                          <img
                            src="images/arrow-right.svg"
                            alt=""
                            loading="lazy"
                          />
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

      {/* ares address section start */}
      <section className="address_main_section mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div className="adress_main plr-20">
                <div className="address_box mb-3">
                  <div className="address_icon">
                    <img src="images/map-pin.svg" alt="" loading="lazy" />
                  </div>
                  <div className="address_info">
                    <p>
                      Hind Nagar, Sector C1, LDA Colony, Uttar Pradesh - 226012
                    </p>
                  </div>
                </div>
                <div className="address_box align-items-center mb-3">
                  <div className="address_icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="address_info">
                    <p>
                      <Link to="mailto:contact@aresstudio.in">
                        contact@aresstudio.in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="adress_main plr-20">
                <div className="address_box mb-3">
                  <div className="address_icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="address_info">
                    <h5>Nik John</h5>
                    <p>Exe Producer</p>
                  </div>
                </div>
                <div className="address_box align-items-center mb-3">
                  <div className="address_icon">
                    <img src="images/call-icon.svg" alt="" loading="lazy" />
                  </div>
                  <div className="address_info">
                    <p>
                      <Link to="tel:+353 0830916495">+353 0830916495</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="adress_main plr-20">
                <div className="address_box mb-3">
                  <div className="address_icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="address_info">
                    <h5>Hari Nair</h5>
                    <p>Director of BusinessDev</p>
                  </div>
                </div>
                <div className="address_box align-items-center mb-3">
                  <div className="address_icon">
                    <img src="images/call-icon.svg" alt="" loading="lazy" />
                  </div>
                  <div className="address_info">
                    <p>
                      <Link to="tel:+91 87654 52462">+91 87654 52462</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-3">
              <div className="adress_main plr-20">
                <div className="address_box mb-3">
                  <div className="address_icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="address_info">
                    <h5>Nik John</h5>
                    <p>Exe Producer</p>
                  </div>
                </div>
                <div className="address_box align-items-center mb-3">
                  <div className="address_icon">
                    <img src="images/call-icon.svg" alt="" />
                  </div>
                  <div className="address_info">
                    <p>
                      <Link to="tel:+91 9876543210">+91 9876543210</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      {/* ares address section close */}

      {/* map section */}
      <section className="map_section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7123.3290274015335!2d80.892633!3d26.786962000000003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfeacaf028b3d%3A0x56245421a57e1827!2sHind%20Nagar%2C%20Sector%20C1%2C%20LDA%20Colony%2C%20Lucknow%2C%20Uttar%20Pradesh%20226012!5e0!3m2!1sen!2sin!4v1715782044865!5m2!1sen!2sin"
          width="100%"
          height="450"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="map"
        ></iframe>
      </section>
    </Layout>
  );
}
