import React from "react";
import ReactDOM from "react-dom";
import Tabs from "components/Tabs";

import "styles/popup.scss";

const ButtonsGroup = () => {
  const btns = [
    {
      text: "Delete Selected",
      className: "delete-selected",
    },
    {
      text: "Delete Favorites",
      className: "delete-favs",
    },
    {
      text: "Delete Non Favorites",
      className: "delete-no-favs",
    },
    {
      text: "Clear History",
      className: "clear-history",
    },
  ].map(({ className, text }) => (
    <button key={className} className={`btn ${className}`}>
      {text}
    </button>
  ));

  return <div className="btn-wrapper">{btns}</div>;
};

const PopUpPage = () => (
  <div className="popup-container">
    <ButtonsGroup />
    <Tabs />
    <div className="history-content" />
    <div className="favs-content hidden" />
  </div>
);

export default () => {
  ReactDOM.render(<PopUpPage />, document.getElementById("root"));
};
