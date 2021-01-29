import React from "react";
import "styles/tabs.scss";

const Tabs = () => (
  <div className="tabs">
    <nav className="header">
      <h3
        data-tab-type="history"
        data-tabs
        id="tab-history"
        className="tab active"
      >
        History
      </h3>
      <h3 data-tab-type="favs" data-tabs id="tab-favs" className="tab">
        Favorites
      </h3>
    </nav>
    <div className="target"></div>
  </div>
);

export default Tabs;
