import React from "react";
import SideNavigation from "./header.js";
import Footer from "./Footer";
import "../style/user.css";

const Layout = ({ children }) => {
  return (
    <>
      <SideNavigation />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
