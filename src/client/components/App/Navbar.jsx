import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import logo from "../../../../public/assets/media/logo.png"; // ! temp...
import { MButton } from "../Materials";
import { isCurrentPath } from "./utils";

/**
 * Navbar. Rendered at the top of the main `App` component. Contains navigation options.
 *
 * @returns {*} ReactElement<any>
 */
const Navbar = () => (
  <Fragment>
    <h2>
      <Link disabled={isCurrentPath("/")} to="/">
        <img style={{ height: "2em" }} src={logo} alt="logo" />
      </Link>
    </h2>
    <div>
      <MButton
        disabled={isCurrentPath("/get-involved")}
        name="Get Involved"
        redirect="get-involved"
      />
      <MButton
        disabled={isCurrentPath("/planters")}
        name="Tree Planters"
        redirect="planters"
      />
      <MButton
        disabled={isCurrentPath("/support")}
        name="Support"
        redirect="support"
      />
      <MButton
        disabled={isCurrentPath("/explore")}
        name="Explore the Trees"
        redirect="explore"
      />
      <MButton
        disabled={isCurrentPath("/about")}
        name="About Greenstand"
        redirect="about"
      />
      <MButton
        disabled={isCurrentPath("/contact")}
        name="Contact"
        redirect="contact"
      />
    </div>
  </Fragment>
);

export default Navbar;
