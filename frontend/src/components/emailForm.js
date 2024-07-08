// import React, { useState } from "react";
// import { Modal, Form, Button } from "react-bootstrap";
// import axios from "axios";
// import "../style/user.css";

// const EmailForm = ({ modalVisible, setModalVisible }) => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const access_token = localStorage.getItem("access_token");

//       const response = await axios.post("/api/email", { email });
//       setMessage(response.data.message);
//     } catch (error) {
//       setMessage(`Error: ${error.response.data.message}`);
//     }
//   };

//   return (
//     <div>
//       <Modal
//         className="media_modal locked_modal"
//         show={modalVisible}
//         onHide={() => setModalVisible(false)}
//       >
//         <Modal.Header closeButton></Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleFormSubmit}>
//             <Form.Group controlId="formUnlockCode">
//               <div>
//                 <img
//                   className="lock-pop"
//                   src="images/lock-popup-icon.svg"
//                   alt="Lock Pop-up Icon"
//                 />
//               </div>
//               <div>
//                 <h2 className="mb-5">Enter Email Address to get password</h2>
//               </div>
//               <div className="lock-form">
//                 <div className="lock-ic">
//                   <img src="images/lock-form-icon.svg" alt="Lock Form Icon" />
//                 </div>
//                 <div className="lock-paswd">
//                   <Form.Control
//                     type="email"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Submit
//             </Button>
//             {message && <p>{message}</p>}
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default EmailForm;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../style/user.css";

const EmailForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit(email);

      setSuccessMessage(
        "Email submitted successfully. Please check your inbox for the password."
      );
    } catch (error) {
      setErrorMessage("Some error occurred in form submission. Try again!");
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group controlId="formEmail">
        <div>
          <img
            className="lock-pop"
            src="/images/lock-popup-icon.svg"
            alt="Lock Pop-up Icon"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="mb-5">Enter Email Address to get password</h2>
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
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
      {message && <p>{message}</p>}
    </Form>
  );
};

export default EmailForm;
