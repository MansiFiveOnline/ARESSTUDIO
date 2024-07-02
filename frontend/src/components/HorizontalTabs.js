// import React, { useState } from "react";
// import "../style/user.css";

// const HorizontalTabs = () => {
//   const [activeTab, setActiveTab] = useState("City1"); // Default active tab

//   const openCity = (cityName) => {
//     setActiveTab(cityName);
//   };

//   return (
//     <>
//       {/* Tab buttons */}
//       <div className="tab">
//         <button
//           className={`tablinks ${activeTab === "City1" ? "active" : ""}`}
//           onClick={() => openCity("City1")}
//           id="defaultOpen"
//         >
//           <div className="position_name">
//             <h3>Modeling Artist</h3>
//           </div>
//           <div className="space-height"></div>
//           <div className="position_info">
//             <p>
//               We are currently in search of Modelers with minimum of 2-3 years
//               of experience to join our Game Art Team
//             </p>
//           </div>
//         </button>
//         <button
//           className={`tablinks ${activeTab === "City2" ? "active" : ""}`}
//           onClick={() => openCity("City2")}
//         >
//           <div className="position_name">
//             <h3>Production Coordinator</h3>
//           </div>
//           <div className="space-height"></div>
//           <div className="position_info">
//             <p>
//               We are currently in search of Co-Ordinators with minimum of 2
//               years of experience to join our Project Management Team
//             </p>
//           </div>
//         </button>
//         <button
//           className={`tablinks ${activeTab === "City3" ? "active" : ""}`}
//           onClick={() => openCity("City3")}
//         >
//           <div className="position_name">
//             <h3>Lighting / Lookdev Artist</h3>
//           </div>
//           <div className="space-height"></div>
//           <div className="position_info">
//             <p>
//               We are currently in search of Lighting / Lookdev Artists with
//               minimum 3-4 years of experience to join our Lighting Team.
//             </p>
//           </div>
//         </button>
//         <button
//           className={`tablinks ${activeTab === "City4" ? "active" : ""}`}
//           onClick={() => openCity("City4")}
//         >
//           <div className="position_name">
//             <h3>Mid-Texturing Artist</h3>
//           </div>
//           <div className="space-height"></div>
//           <div className="position_info">
//             <p>
//               We are currently in search of Mid Texturing Artists with minimum
//               3-4 years of experience to join our Game Art Team
//             </p>
//           </div>
//         </button>
//       </div>

//       {/* Tab content */}
//       <div
//         id="City1"
//         className="tabcontent"
//         style={{ display: activeTab === "City1" ? "block" : "none" }}
//       >
//         <div className="container">
//           <div className="resp_duty">
//             <h4>Responsibilities and Duties</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>

//           <div className="resp_duty">
//             <h4>Qualifications</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div
//         id="City2"
//         className="tabcontent"
//         style={{ display: activeTab === "City2" ? "block" : "none" }}
//       >
//         <div className="container">
//           <div className="resp_duty">
//             <h4>Responsibilities and Duties 2</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>

//           <div className="resp_duty">
//             <h4>Qualifications</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div
//         id="City3"
//         className="tabcontent"
//         style={{ display: activeTab === "City3" ? "block" : "none" }}
//       >
//         <div className="container">
//           <div className="resp_duty">
//             <h4>Responsibilities and Duties 3</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>

//           <div className="resp_duty">
//             <h4>Qualifications</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div
//         id="City4"
//         className="tabcontent"
//         style={{ display: activeTab === "City4" ? "block" : "none" }}
//       >
//         <div className="container">
//           <div className="resp_duty">
//             <h4>Responsibilities and Duties 4</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>

//           <div className="resp_duty">
//             <h4>Qualifications</h4>
//             <ul>
//               <li>
//                 Create models as well as sculpt (sets, props, characters, etc.),
//                 following the creative direction of the designated supervisor.
//               </li>
//               <li>
//                 Follow leads and supervisors' direction, ensuring that the
//                 models created are precise and accurate.
//               </li>
//               <li>
//                 Complete assigned modeling tasks in a timely manner and ensure
//                 all working files are efficiently organized at all times.
//               </li>
//               <li>
//                 Fully comprehend the requirements on the designs, thereby
//                 creating models true to their designs, whether organic or
//                 mechanical in nature.
//               </li>
//               <li>
//                 Address feedback and modify models by following the creative
//                 direction of the Supervising Modeler, Production Designer, and
//                 Cinematics Director/Producer.
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HorizontalTabs;

// import React, { useState, useEffect } from "react";
// import "../style/user.css";
// import axios from "axios";

// const HorizontalTabs = ({ opportunities }) => {
//   const [activeTab, setActiveTab] = useState(0); // Default active tab

//   const openOpportunity = (index) => {
//     setActiveTab(index);
//   };

//   useEffect(() => {
//     const fetchOpportunity = async () => {
//       try {
//         const response = await axios.get(`/api/opportunity`);
//         console.log(response.data.oppportunities);
//         console.log("title", response.data.oppportunities[0].title);

//         // console.log("filepath", response.data.oppportunities.media[0].filepath);
//         if (
//           response.data.oppportunities &&
//           response.data.oppportunities.length > 0
//         ) {
//           console.log(
//             "filepath",
//             response.data.oppportunities[0].media.filepath
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching opportunities details:", error);
//       }
//     };

//     fetchOpportunity();
//   }, []);

//   return (
//     <>
//       {/* Tab buttons */}
//       <div className="tab">
//         {opportunities &&
//           opportunities.map((opportunity, index) => (
//             <button
//               key={index}
//               className={`tablinks ${activeTab === index ? "active" : ""}`}
//               onClick={() => openOpportunity(index)}
//             >
//               <div className="position_name">
//                 <h3>{opportunity.title}</h3>
//               </div>
//               <div className="space-height"></div>
//               <div className="position_info">
//                 <p>{opportunity.description}</p>
//               </div>
//             </button>
//           ))}
//       </div>

//       {/* Tab content */}
//       {opportunities &&
//         opportunities.map((opportunity, index) => (
//           <div
//             key={index}
//             id={`Opportunity${index}`}
//             className="tabcontent"
//             style={{ display: activeTab === index ? "block" : "none" }}
//           >
//             <div className="container">
//               <div className="resp_duty">
//                 <h4>Responsibilities and Duties</h4>
//                 <p>{opportunity.responsibility}</p>
//               </div>

//               <div className="resp_duty">
//                 <h4>Qualifications</h4>
//                 <p>{opportunity.qualification}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//     </>
//   );
// };

// export default HorizontalTabs;

import React, { useState } from "react";
import "../style/user.css";

const HorizontalTabs = ({ opportunities }) => {
  const [activeTab, setActiveTab] = useState(0); // Default active tab

  const openOpportunity = (index) => {
    setActiveTab(index);
  };

  // useEffect(() => {
  //   const fetchOpportunity = async () => {
  //     try {
  //       const response = await axios.get(`/api/opportunity`);
  //       console.log(response.data.opportunities); // Corrected spelling
  //       if (
  //         response.data.opportunities &&
  //         response.data.opportunities.length > 0
  //       ) {
  //         console.log("title", response.data.opportunities[0].title);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching opportunities details:", error);
  //     }
  //   };

  //   fetchOpportunity();
  // }, []);

  if (!opportunities || opportunities.length === 0) {
    return <div>No opportunities available</div>;
  }

  return (
    <>
      {/* Tab buttons */}
      <div className="tab">
        {opportunities.map((opportunity, index) => (
          <button
            key={index}
            className={`tablinks ${activeTab === index ? "active" : ""}`}
            onClick={() => openOpportunity(index)}
          >
            <div className="position_name">
              <h3>{opportunity.title}</h3>
            </div>
            <div className="space-height"></div>
            <div className="position_info">
              <p>{opportunity.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {opportunities.map((opportunity, index) => (
        <div
          key={index}
          id={`Opportunity${index}`}
          className="tabcontent"
          style={{ display: activeTab === index ? "block" : "none" }}
        >
          <div className="container">
            <div className="resp_duty">
              <h4>Responsibilities and Duties</h4>
              <p>{opportunity.responsibility}</p>
            </div>

            <div className="resp_duty">
              <h4>Qualifications</h4>
              <p>{opportunity.qualification}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default HorizontalTabs;
