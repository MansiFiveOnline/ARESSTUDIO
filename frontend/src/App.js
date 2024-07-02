import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminHome from "./pages/admin/home";
import Application from "./pages/admin/application";
import Team from "./pages/admin/team/team";
import AdminContact from "./pages/admin/contact";
import Login from "./pages/admin/login";
// import Register from "./pages/register";
import AddTeam from "./pages/admin/team/addteam";
import EditTeam from "./pages/admin/team/editteam";
import Gallery from "./pages/admin/gallery/gallery";
import GalleryName from "./pages/admin/gallery_name/gallery-name";
import AdminServices from "./pages/admin/services/services";
// import AdminCareer from "./pages/admin/career/career";
// import AddCareer from "./pages/admin/career/addcareer";
import EditCareer from "./pages/admin/career/editcareer";
import AddGallery from "./pages/admin/gallery/addgallery";
import EditGallery from "./pages/admin/gallery/editgallery";
import AddOpportunity from "./pages/admin/opportunity/addopportunity";
import EditOpportunity from "./pages/admin/opportunity/editopportunity";
import Opportunities from "./pages/admin/opportunity/opportunity";
import AddService from "./pages/admin/services/addservice";
import EditService from "./pages/admin/services/editservice";
import EditAbout from "./pages/admin/about/editabout";
import AddGalleryName from "./pages/admin/gallery_name/addgallery_name";
import EditGalleryName from "./pages/admin/gallery_name/editgallery_name";
import Project from "./pages/admin/project/project";
import AddProject from "./pages/admin/project/addproject";
import EditProject from "./pages/admin/project/editproject";
import ProjectDetail from "./pages/admin/projectDetail/projectDetail";
import AddProjectDetail from "./pages/admin/projectDetail/addprojectDetail";
import EditProjectDetail from "./pages/admin/projectDetail/editprojectDetail";
import Password from "./pages/admin/password/password";
import EditPassword from "./pages/admin/password/editpassword";
import AddPassword from "./pages/admin/password/addpassword";

import AdminRoute from "./routes/AdminRoutes";

import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Service from "./pages/user/Service";
import Pagenotfound from "./pages/user/Pagenotfound";
import Contact from "./pages/user/Contact";
import Career from "./pages/user/Career";
import Servicedetail from "./pages/user/Servicedetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service/:service_name" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career" element={<Career />} />
        <Route
          path="/service-detail/:project_name"
          element={<Servicedetail />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminHome />} />
          <Route path="team" element={<Team />} />
          <Route path="applications" element={<Application />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="add/team" element={<AddTeam />} />
          <Route path="edit/team/:id" element={<EditTeam />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery_name" element={<GalleryName />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="edit/about" element={<EditAbout />} />
          {/* <Route path="career" element={<AdminCareer />} /> */}
          {/* <Route path="add/career" element={<AddCareer />} /> */}
          <Route path="edit/career" element={<EditCareer />} />
          <Route path="add/gallery" element={<AddGallery />} />
          <Route path="edit/gallery/:id" element={<EditGallery />} />
          <Route path="add/opportunity" element={<AddOpportunity />} />
          <Route path="edit/opportunity/:id" element={<EditOpportunity />} />
          <Route path="add/service" element={<AddService />} />
          <Route path="edit/service/:id" element={<EditService />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="add/gallery_name" element={<AddGalleryName />} />
          <Route path="edit/gallery_name/:id" element={<EditGalleryName />} />
          <Route path="project" element={<Project />} />
          <Route path="add/project" element={<AddProject />} />
          <Route path="edit/project/:id" element={<EditProject />} />
          <Route path="project_detail" element={<ProjectDetail />} />
          <Route path="add/project_detail" element={<AddProjectDetail />} />
          <Route
            path="edit/project_detail/:id"
            element={<EditProjectDetail />}
          />
          <Route path="password" element={<Password />} />

          <Route path="edit/password/:id" element={<EditPassword />} />
          <Route path="add/password/:id" element={<AddPassword />} />
        </Route>

        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </Router>
  );
}

export default App;
