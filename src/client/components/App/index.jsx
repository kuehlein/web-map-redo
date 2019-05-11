import React from "react";
import { withRouter } from "react-router-dom";

// * import app.css before other components to apply styles
// import "./app.css";

import Footer from "./Footer";
import Main from "./Main";
import Navbar from "./Navbar";
import Routes from "./Routes";

/**
 * Top level component of app. Wrapped with providers and rendered by
 * `ReactDOM.render()` in `client/index.jsx`.
 *
 * @returns {*} ReactElement<any>
 */
const App = () => (
  <div style={{ backgroundColor: "green" }}>
    <Navbar />
    <hr />
    <Main>
      <Routes />
    </Main>
    <Footer />
  </div>
);

export default withRouter(App);
