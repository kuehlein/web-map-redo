import React, { createContext, useState } from "react";

// * import app.css before other components to apply styles
// import "./app.css";

import { WebMap } from "..";
import { InfoWindow } from "@react-google-maps/api";

import './app.module.scss';

const Context = createContext();

/**
 * Top level component of app. Wrapped with providers and rendered by
 * `ReactDOM.render()` in `client/index.jsx`.
 *
 * @returns {*} ReactElement<any>
 */
const App = () => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState(null);
  console.log(showInfoWindow, infoWindowData)
  return (
    <Context.Provider>
      <main>
        <div className="test">THIS WORKS</div>
        {showInfoWindow && <InfoWindow infoWindowData={infoWindowData} />}
        <WebMap
          setShowInfoWindow={setShowInfoWindow}
          setInfoWindowData={setInfoWindowData}
        />
      </main>
    </Context.Provider>
  );
};

export default App;
