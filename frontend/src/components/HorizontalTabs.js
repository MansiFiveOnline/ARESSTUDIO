import React, { useState } from "react";
import "../style/user.css";
import Parse from "html-react-parser";

const HorizontalTabs = ({ opportunities }) => {
  const [activeTab, setActiveTab] = useState(0); // Default active tab

  const openOpportunity = (index) => {
    setActiveTab(index);
  };

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
              <p>{Parse(opportunity.description)}</p>
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
              <p>{Parse(opportunity.responsibility)}</p>
            </div>

            <div className="resp_duty">
              <h4>Qualifications</h4>
              <p>{Parse(opportunity.qualification)}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default HorizontalTabs;
