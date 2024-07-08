// import React, { useState } from "react";
// import { Form, Button } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import "../style/user.css";

// const PasswordForm = ({ onSubmit, projectName }) => {
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     // Call onSubmit callback to validate the password
//     // const isValidPassword = await onSubmit(password);

//     // if (isValidPassword) {
//     // Redirect to the service detail page if the password is correct
//     alert("Form submitted successfully.");
//     console.log("Project name", projectName);
//     if (projectName) {
//       // const formattedProjectName = projectName
//       //   .toLowerCase()
//       //   .trim()
//       //   .replace(/\s+/g, "-");
//       navigate(`/service-detail/${projectName}`);
//     } else {
//       console.error("Project name is undefined.");
//     }

//     // }
//     //  else {
//     //   // Handle incorrect password logic if needed
//     //   alert("Incorrect password! Please try again.");
//     // }
//   };

//   return (
//     <Form onSubmit={handleFormSubmit}>
//       <Form.Group controlId="formPassword">
//         <div>
//           <img
//             className="lock-pop"
//             src="images/lock-popup-icon.svg"
//             alt="Lock Pop-up Icon"
//           />
//         </div>
//         <div>
//           <h2 className="mb-5">Enter Password to Access this Area</h2>
//         </div>
//         <div className="lock-form">
//           <div className="lock-ic">
//             <img src="images/lock-form-icon.svg" alt="Lock Form Icon" />
//           </div>
//           <div className="lock-paswd">
//             <Form.Control
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//         </div>
//       </Form.Group>
//       <Button variant="primary" type="submit">
//         Submit
//       </Button>
//       <div className="get_paswd">
//         <Link>Click here to share another email id</Link>
//       </div>
//     </Form>
//   );
// };

// export default PasswordForm;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../style/user.css";
import axios from "axios";

const PasswordForm = ({ onSubmit, projectName, onLinkClick }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/email/validate-password`,
        { password }
      );

      if (response.data.isValid) {
        if (projectName) {
          const formattedProjectName = projectName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
          setTimeout(() => {
            navigate(`/service-detail/${formattedProjectName}`);
          }, "1500");
        } else {
          console.error("Project name is undefined.");
        }
      } else {
        setErrorMessage("Incorrect password! Please try again.");
      }

      setSuccessMessage("Password validated successfully!");
    } catch (error) {
      console.error("Error validating password:", error);
      setErrorMessage(
        "An error occurred during password validation. Please try again."
      );
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group controlId="formPassword">
        <div>
          <img
            className="lock-pop"
            src="/images/lock-popup-icon.svg"
            alt="Lock Pop-up Icon"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="mb-5">Enter Password to Access this Area</h2>
        </div>
        <div className="lock-form">
          <div className="lock-ic">
            <img
              src="/images/lock-form-icon.svg"
              alt="Lock Form Icon"
              loading="lazy"
            />
          </div>
          <div className="lock-paswd">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {errorMessage && (
          <div className="error-message text-danger mt-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="success-message text-success mt-2">
            {successMessage}
          </div>
        )}
      </Form.Group>
      <Button type="submit">Submit</Button>
      <div className="get_paswd">
        <Link to="#" onClick={onLinkClick}>
          Click here to get password
        </Link>
      </div>
    </Form>
  );
};

export default PasswordForm;
