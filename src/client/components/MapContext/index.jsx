import PropTypes from "prop-types";
import React, { createContext } from "react";

// ! DOCS
export const MapContext = createContext({});

/**
 * ! DOCS
 */
const MapContextProvider = props => {
  const { children } = props;
  return <MapContext.Provider value={{}}>{children}</MapContext.Provider>;
};

/**
 * *---------------------------------------------------------------------------*
 * *-----------------------------* Prop Types *--------------------------------*
 * *---------------------------------------------------------------------------*
 */

MapContextProvider.propTypes = {
  children: PropTypes.element.isRequired
};
