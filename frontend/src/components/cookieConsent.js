import React, { useState } from "react";

const CookieConsent = ({ onAccept }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleAccept = () => {
    // Store cookie consent in local storage
    localStorage.setItem("cookieConsent", "true");

    // Hide the popup
    setShowPopup(false);

    // Execute any additional actions on accept
    onAccept();
  };

  const handleClose = () => {
    // Hide the popup
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div className="cookie-consent">
        <p>
          We use cookies to improve your experience. By using our site, you
          agree to our use of cookies.
        </p>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleClose}>Decline</button>
      </div>
    )
  );
};

export default CookieConsent;
