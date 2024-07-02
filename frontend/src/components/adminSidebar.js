import React from "react";
import { NavLink } from "react-router-dom";
import "../style/index.css";
import { useAuth } from "../context/authContext";

// import PeopleIcon from "@mui/icons-material/People";
// import ArticleIcon from "@mui/icons-material/Article";
// import CallIcon from "@mui/icons-material/Call";
// import HowToRegIcon from "@mui/icons-material/HowToReg";
// import LoginIcon from "@mui/icons-material/Login";
// import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const { auth, setAuth } = useAuth();

  console.log("Auth:", auth);
  console.log("User:", auth.user);
  console.log("Access Token:", auth.access_token);
  console.log("LocalStorage - auth:", localStorage.getItem("auth"));
  console.log(
    "LocalStorage - access_token:",
    localStorage.getItem("access_token")
  );

  const handleLogout = () => {
    setAuth({
      user: null,
      access_token: "",
    });
    localStorage.removeItem("access_token");
  };

  if (!auth) {
    // Handle case when auth is not defined
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="sidebar-brand">
        <NavLink to="/admin/dashboard">
          <img
            className="admin-logo"
            src="/images/ares_favicon.png"
            alt="Logo"
          />{" "}
          ARES Studio
        </NavLink>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className="nav-link" title="Home">
              <span className="las la-home"></span> <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/services" title="Services">
              <span className="las la-hands-helping"></span>{" "}
              <span>Services</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/gallery" title="Gallery">
              <span className="las la-photo-video"></span>{" "}
              <span>Service Gallery</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/gallery_name" title="Gallery Name">
              <span className="las la-images"></span>{" "}
              <span>Service Gallery Name</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/project" title="Project">
              <span className="las la-briefcase"></span> <span>Project</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/project_detail" title="Project Detail">
              <span className="las la-tasks"></span> <span>Project Detail</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/password" title="Passwords">
              <span className="las la-lock"></span> <span>Passwords</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/edit/about" title="About Us">
              <span className="las la-user-friends"></span>{" "}
              <span>About Us</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/team" title="Team">
              <span className="las la-users"></span> <span>Team</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/edit/career" title="Career">
              <span className="las la-user-tie"></span> <span>Career</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/opportunities" title="Opportunities">
              <span className="las la-rocket"></span> <span>Opportunity</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/applications" title="Applications">
              <span className="las la-book"></span> <span>Application</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/contact" title="Contact Us">
              <span className="las la-map-marker"></span>{" "}
              <span>Contact Us</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/register" title="Register">
              <span className="las la-certificate"></span> <span>Register</span>
            </NavLink>
          </li> */}

          {/* {about.map((aboutItem) => ( */}

          {/* ))} */}

          <li className="logout-menu" title="Logout">
            <NavLink to="/login" onClick={handleLogout}>
              <span className="las la-sign-out-alt"></span> <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
    // <nav className="navbar bg-body-tertiary fixed-top">
    //   <div className=" container-fluid">
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="offcanvas"
    //       data-bs-target="#offcanvasNavbar"
    //       aria-controls="offcanvasNavbar"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>

    //     <NavLink className="navbar-brand" to="/team">
    //       <h2>ARES Studio</h2>
    //     </NavLink>
    //     <div className="user-wrapper dropdown">
    //       <button onclick="myFunction()" className="dropbtn">
    //         <img src="src/img/user-icon-img.png" width="40px" height="40px" />
    //         <small>Super Admin</small>
    //       </button>

    //       <div id="myDropdown" className="dropdown-content">
    //         <NavLink to="" title="Logout">
    //           <i className="las la-sign-out-alt"></i> Logout
    //         </NavLink>
    //       </div>
    //     </div>
    //     <div
    //       className="offcanvas offcanvas-start"
    //       tabIndex="-1"
    //       id="offcanvasNavbar"
    //       aria-labelledby="offcanvasNavbarLabel"
    //     >
    //       <div className="offcanvas-header">
    //         <NavLink className="navbar-brand" to="/team">
    //           <h5>ARES Studio</h5>
    //         </NavLink>
    //         <button
    //           type="button"
    //           className="btn-close"
    //           data-bs-dismiss="offcanvas"
    //           aria-label="Close"
    //         ></button>
    //       </div>
    //       <div className="sidebar-menu">
    //         <ul className="sidebar-nav justify-content-start flex-grow-1 pe-3">
    //         <li className="nav-item">
    //             <Link
    //               className="nav-link active"
    //               aria-current="page"
    //               to="/team"
    //             >
    //               <PeopleIcon />
    //               <span>Home</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link
    //               className="nav-link"
    //               aria-current="page"
    //               to="/team"
    //             >
    //               <PeopleIcon />
    //               <span>Team</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link className="nav-link" to="/application">
    //               <ArticleIcon /> <span>Application</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link className="nav-link" to="/contact">
    //               <CallIcon /> <span>Contact</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link className="nav-link" to="/register">
    //               <HowToRegIcon /> <span>Register</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link className="nav-link" to="/login">
    //               <LoginIcon /> <span>Login</span>
    //             </Link>
    //           </li>
    //           <li className="nav-item logout-menu" title="Logout">
    //             <Link to="/logout">
    //               <LogoutIcon />
    //               <span>Logout</span>
    //             </Link>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default SideBar;
