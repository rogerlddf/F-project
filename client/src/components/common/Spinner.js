import React from "react";

import spinner from "../../img/spinner.gif";

import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner">
      <img className="indicator" src={spinner} alt="Loading..." />
    </div>
  );
};

export default Spinner;
