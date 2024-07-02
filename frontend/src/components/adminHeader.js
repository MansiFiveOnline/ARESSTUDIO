import React from "react";
import "../style/index.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <h2>
        <label htmlFor="nav-toggle">
          <span className="las la-bars"></span>
        </label>
      </h2>
      <div className="user-wrapper dropdown">
        <button onclick="myFunction()" className="dropbtn">
          {/* <img src="src/img/user-icon-img.png" width="40px" height="40px" /> */}
          <small>Super Admin</small>
        </button>

        <div id="myDropdown" className="dropdown-content">
          {/* <a href="my-profile.php" title="My Profile"><i className="las la-user"></i> My Profile</a>
		    	<a href="user-permissions.php" title="Users and permissions"><i className="las la-user-circle"></i> Users and permissions</a> */}
          <NavLink to="/logout" title="Logout">
            <i className="las la-sign-out-alt"></i> Logout
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
