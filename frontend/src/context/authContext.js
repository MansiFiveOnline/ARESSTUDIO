// import { useState, useEffect, useContext, createContext } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     user: null,
//     access_token: "",
//   });

//   //default axios
//   axios.defaults.headers.common["Authorization"] = auth?.access_token;

//   useEffect(() => {
//     const data = localStorage.getItem("auth");
//     if (data) {
//       const parsedData = JSON.parse(data);
//       setAuth({
//         ...auth,
//         user: parsedData.user,
//         access_token: parsedData.access_token,
//       });
//     }
//     // eslint disable-next-line
//   }, []);
//   return (
//     <AuthContext.Provider value={[auth, setAuth]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook useAuth
// const useAuth = () => {
//   return useContext(AuthContext);
// };

// export { useAuth, AuthProvider };

// import { useState, useEffect, useContext, createContext } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     user: null,
//     access_token: "",
//   });

//   //default axios
//   useEffect(() => {
//     const access_token = localStorage.getItem("access_token");
//     console.log("Access token:", access_token); // Log access token
//     console.log("LocalStorage - auth:", localStorage.getItem("auth"));
//     console.log(
//       "LocalStorage - access_token:",
//       localStorage.getItem("access_token")
//     );

//     const data = localStorage.getItem("auth");
//     if (data) {
//       const parsedData = JSON.parse(data);
//       setAuth({
//         ...auth,
//         user: parsedData.user,
//         access_token: parsedData.access_token,
//       });
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${parsedData.access_token}`;
//     }
//     // eslint-disable-next-line
//   }, []);

//   // Update axios header when auth changes
//   useEffect(() => {
//     axios.defaults.headers.common[
//       "Authorization"
//     ] = `Bearer ${auth.access_token}`;
//   }, [auth]);

//   return (
//     <AuthContext.Provider value={[auth, setAuth]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook useAuth
// const useAuth = () => {
//   return useContext(AuthContext);
// };

// export { useAuth, AuthProvider };

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    access_token: "",
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuth(parsedAuth);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedAuth.access_token}`;
      } catch (error) {
        console.error("Error parsing authentication information:", error);
      }
    }
  }, []);

  const logout = () => {
    setAuth({ user: null, access_token: "" });
    localStorage.removeItem("auth");
    axios.defaults.headers.common["Authorization"] = "";
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
