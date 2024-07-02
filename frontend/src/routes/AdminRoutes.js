// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/authContext";
// import { Outlet, Navigate } from "react-router-dom";
// import axios from "axios";

// const AdminRoute = () => {
//   const [valid, setValid] = useState(null);
//   const [auth] = useAuth();

//   useEffect(() => {
//     const authCheck = async () => {
//       try {
//         const access_token = localStorage.getItem("access_token");
//         console.log("Access token:", access_token); // Log access token
//         if (!auth || !auth.access_token) {
//           setValid(false);
//           return;
//         }
//         const res = await axios.get(`http://localhost:8000/api/auth/admin`, {
//           headers: {
//             Authorization: `Bearer ${auth.access_token}`,
//           },
//         });

//         console.log("Response:", res.data);

//         if (res && res.data && res.data.valid) {
//           setValid(true);
//         } else {
//           setValid(false);
//         }
//       } catch (error) {
//         console.log("Not valid admin", error);
//         setValid(false);
//       }
//     };

//     authCheck();
//   }, [auth]);

//   // Log valid state
//   console.log("Valid:", valid);

//   // Render loading state while authentication check is in progress
//   if (valid === null) return <div>Loading...</div>;

//   // Redirect to login page if not authenticated
//   return valid ? <Outlet /> : <Navigate to="/login" />;
// };

// export default AdminRoute;

import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminRoute = () => {
  const [valid, setValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        console.log("Access token:", access_token); // Log access token
        if (!access_token) {
          setValid(false);
          return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;

        const res = await axios.get(`${apiUrl}/api/auth/admin`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        console.log("Response:", res.data);

        if (res && res.data && res.data.valid) {
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (error) {
        console.log("Not valid admin", error);
        setValid(false);
      }
    };

    authCheck();
  }, []);

  // Log valid state
  console.log("Valid:", valid);

  // Render loading state while authentication check is in progress
  if (valid === null) return <div>Loading...</div>;

  // Redirect to login page if not authenticated
  if (!valid) {
    navigate("/login"); // Navigate to login page
    return null; // Return null to prevent rendering anything
  }

  // Render the nested routes if authenticated
  return <Outlet />;
};

export default AdminRoute;
