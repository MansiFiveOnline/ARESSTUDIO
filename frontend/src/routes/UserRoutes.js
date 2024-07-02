import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";
import axios from "axios";

const PrivateUser = () => {
  const [valid, setValid] = useState();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(
        `/auth/user`
        // , {
        //   headers: {
        //     Authorization: auth?.accessToken,
        //   },
        // }
      );
      if (res.data.valid) {
        setValid(true);
      } else {
        setValid(false);
      }
    };
    if (auth?.accessToken) authCheck();
  }, [auth?.accessToken]);
  return valid ? <Outlet /> : "Not Valid";
};

export default PrivateUser;
