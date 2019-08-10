import React from "react";

import scriptFail from "./error";

/**
 * Error message...
 */
const ErrorMessage = () => (
  <div id="error-container" className="container">
    <div id="error-message-div" className="row">
      <h1>Error</h1>
    </div>
    <div id="remedy-message-div" className="row">
      <h1>Remedy</h1>
    </div>
  </div>
);

export default ErrorMessage;
