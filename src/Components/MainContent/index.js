import React from "react";
import "./MainContent.css";

// Component
import MainPage from "../MainPage";
import InfoSection from "../InfoSection";
import Suggestions from "../Suggestions";

const MainContent = () => {
  return (
    <div className="mainContent">
      <div className="posts_container">
        <div className="posts_row">
          <div className="posts_col posts_col-exhibit">
            {/* <SatausBar /> */}
            <MainPage />
          </div>
          <div className="posts_col posts_col-info ">
            <div className="posts_col-float">
              <InfoSection />
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
