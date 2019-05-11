import PropTypes from "prop-types";
import React, { ReactElement } from "react";

/**
 * Main container in app. Wraps all views. Rendered in the main `App` component.
 *
 * @returns {*} ReactElement<any>
 */
const Main = ({ children }) => <div>{children}</div>;

Main.defaultProps = {
  children: <div />
};

Main.propTypes = {
  children: ReactElement || PropTypes.string
};

export default Main;
