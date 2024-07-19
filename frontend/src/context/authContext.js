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
