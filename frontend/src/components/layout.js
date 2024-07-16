import React from "react";
import SideNavigation from "./header.js";
import Footer from "./Footer";
import "../style/user.css";

const Layout = ({ children, style }) => {
  return (
    <>
      <SideNavigation style={style} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
