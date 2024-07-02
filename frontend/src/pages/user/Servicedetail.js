// import React, { useEffect, useState } from "react";
// import Layout from "../../components/layout";
// import { Link, useParams } from "react-router-dom";
// import Lightboxcomponent from "../../components/Lightboxcomponent";
// import "../../style/user.css";
// import axios from "axios";
// import VideoPlayer from "../../components/Videoplayer";

// // Function to reverse the formatted project name
// const reverseFormat = (formattedName) => {
//   let originalName = formattedName
//     .split("-")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ")
//     .trim();
//   return originalName;
// };

// const Servicedetail = () => {
//   const { project_name } = useParams();
//   const [projectData, setProjectData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   // const projectName = project_name;

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         // const decodedProjectName = reverseFormat(projectName); // Reverse the formatting
//         console.log("Decoded Project Name", project_name);
//         const encodedProjectName = encodeURIComponent(project_name);

//         const response = await axios.get(
//           `http://localhost:8000/api/project/project_details?project_name=${encodedProjectName}`
//         );
//         setProjectData(response.data.project);
//         console.log(response.data.project.project_name);
//         if (
//           response.data.project.media &&
//           response.data.project.media.length < 0
//         ) {
//           console.log(response.data.project.media[0].filename);
//         }
//       } catch (error) {
//         console.error("Error fetching project data:", error);
//         setErrorMessage(
//           "No media found for the given service and gallery name."
//         );
//       }
//     };

//     fetchProject();
//   }, [project_name]);

//   return (
//     <Layout>
//       {projectData ? (
//         <>
//           <div className="project_section position-relative">
//             <div className="app">
//               <div className="video-list">
//                 {projectData.media && projectData.media.iframe ? (
//                   <VideoPlayer src={projectData.media.iframe} />
//                 ) : (
//                   <img
//                     src={`http://localhost:8000/${projectData.media.filepath}`}
//                     alt="Media"
//                   />
//                 )}
//               </div>
//             </div>
//             <div className="about_title">
//               <h1>{projectData.project_name}</h1>
//             </div>
//             <div className="arrow_down">
//               <a href="#gaming_sec">
//                 <div class="sr-arrow sr-bounce"></div>
//               </a>
//             </div>
//           </div>

//           {/* Embark on Epic Adventures section start */}
//           <div className="epic_adventures_section pt-5 mt-5" id="gaming_sec">
//             <div className="container">
//               <div className="row justify-content-center">
//                 <div className="col-lg-12 text-center">
//                   <h2 className="pb-5">
//                     {/* <strong>Embark on Epic Adventures,</strong> */}
//                     {/* <br /> */}
//                     {projectData.subtitle}
//                   </h2>
//                   <p>{projectData.description}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Embark on Epic Adventures section close */}

//           {/* Gallery section start */}
//           <section className="mt-5">
//             <div className="container">
//               <div className="row">
//                 <div className="col-lg-12 text-center">
//                   <div className="section_title">
//                     <h2 className="pb-3">Gallery</h2>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </>
//       ) : (
//         <div className="no-media-message text-center">
//           <p>{errorMessage}</p>
//         </div>
//       )}
//       <section>
//         <Lightboxcomponent />
//       </section>
//       {/* Gallery section close */}
//     </Layout>
//   );
// };

// export default Servicedetail;

import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useParams } from "react-router-dom";
import Lightboxcomponent from "../../components/Lightboxcomponent";
import "../../style/user.css";
import axios from "axios";
import VideoPlayer from "../../components/Videoplayer";
import { Helmet } from "react-helmet";

const Servicedetail = () => {
  const { project_name } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const encodedProjectName = encodeURIComponent(project_name);
        console.log("Encoded Project Name:", encodedProjectName);
        const response = await axios.get(
          `${apiUrl}/api/project/project_details?project_name=${encodedProjectName}`
        );
        setProjectData(response.data.project);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setErrorMessage(
          "No media found for the given service and gallery name."
        );
      }
    };

    fetchProject();
  }, [project_name]);

  return (
    <Layout>
      <Helmet>
        <title>Project | ARES STUDIO</title>
      </Helmet>
      {projectData ? (
        <>
          <div className="project_section position-relative">
            <div className="app">
              <div className="video-list">
                {projectData.media && projectData.media.iframe ? (
                  <VideoPlayer src={projectData.media.iframe} />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${projectData.media.filepath}`}
                    alt="Media"
                  />
                )}
              </div>
            </div>
            <div className="about_title">
              <h1>{projectData.project_name}</h1>
            </div>
            <div className="arrow_down">
              <a href="#gaming_sec">
                <div className="sr-arrow sr-bounce"></div>
              </a>
            </div>
          </div>

          {/* Embark on Epic Adventures section start */}
          <div className="epic_adventures_section pt-5 mt-5" id="gaming_sec">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12 text-center">
                  <h2 className="pb-5">{projectData.subtitle}</h2>
                  <p>{projectData.description}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Embark on Epic Adventures section close */}

          {/* Gallery section start */}
          <section className="mt-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <div className="section_title">
                    <h2 className="pb-3">Gallery</h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="no-media-message text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      <section>
        <Lightboxcomponent project_name={project_name} />
      </section>
      {/* Gallery section close */}
    </Layout>
  );
};

export default Servicedetail;
