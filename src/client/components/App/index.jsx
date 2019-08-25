import React, { createContext, useState } from "react";

import { WebMap } from "..";
import TreeInfo from "../TreeInfo";

import "./app.module.scss";

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
  const [points, setPoints] = useState(null);
  console.log(infoWindowData);
  return (
    <Context.Provider>
      <main>
        {showInfoWindow && (
          <TreeInfo {...{ ...infoWindowData, setInfoWindowData, points }} />
        )}
        <WebMap {...{ setShowInfoWindow, setInfoWindowData, setPoints }} />
      </main>
    </Context.Provider>
  );
};

export default App;
