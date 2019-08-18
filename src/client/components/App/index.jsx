import React, { createContext } from "react";

// * import app.css before other components to apply styles
import "./app.css";

import { WebMap } from "..";

const Context = createContext();

/**
 * Top level component of app. Wrapped with providers and rendered by
 * `ReactDOM.render()` in `client/index.jsx`.
 *
 * @returns {*} ReactElement<any>
 */
const App = () => (
  <Context.Provider>
    <WebMap />
  </Context.Provider>
);

export default App;
