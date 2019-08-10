import PropTypes from "prop-types";
import React, { Component, createContext } from "react";

// ! DOCS
export const MapContext = createContext();

/**
 * ! DOCS
 */
export default class MapContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // who knows yet
    };
  }

  render() {
    const { children } = this.props;

    return (
      <MapContext.Provider value={this.state}>{children}</MapContext.Provider>
    );
  }
}

/**
 * *---------------------------------------------------------------------------*
 * *-----------------------------* Prop Types *--------------------------------*
 * *---------------------------------------------------------------------------*
 */

MapContextProvider.propTypes = {
  children: PropTypes.element.isRequired
};
