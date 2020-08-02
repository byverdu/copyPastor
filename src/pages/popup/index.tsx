import React from "react";
import ReactDOM from "react-dom";

import "styles/popup.scss";

const PopUpPage = () => (
  <div className="popup-container">
    <div className="btn-wrapper">
      <button className="btn delete-selected">Delete Selected</button>
      <button className="btn clear-history">Clear History</button>
    </div>
    <div className="history-content" />
  </div>
);

export default () => {
  ReactDOM.render(<PopUpPage />, document.getElementById("root"));
};
