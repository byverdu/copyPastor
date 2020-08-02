import React from "react";
import ReactDOM from "react-dom";

import Header from "../../components/Header";

import "styles/background.scss";

const LandingPage = () => (
  <div className="background-container">
    <Header title={`Background page`} />
    <div className="target">xoxo</div>
  </div>
);

export default () => {
  ReactDOM.render(<LandingPage />, document.getElementById("root"));
};
