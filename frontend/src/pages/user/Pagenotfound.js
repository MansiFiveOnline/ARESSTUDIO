import React from "react";
import "../../style/user.css";
import { Helmet } from "react-helmet";

export default function Pagenotfound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | ARES STUDIO</title>
      </Helmet>
      <div>
        <h2 style={{ color: "white", textAlign: "center" }}>Page Not Found </h2>
      </div>
    </>
  );
}
