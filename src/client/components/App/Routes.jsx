import loadable from "@loadable/component";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { WebMap } from "..";

/**
 * Client-Side Routing (CSR) component. Index of various routes in the app.
 */
const Routes = () => {
  // loadable used for code splitting
  const LNotFound = loadable(
    async () => ""
    // import(/* webpackChunkName: "notfound" */ "../pages/NotFound")
  );

  return (
    <Switch>
      <Route exact path="/" component={WebMap} />
      {/* Displays a 404 as a fallback */}
      {/* <Route component={LNotFound} /> */}
    </Switch>
  );
};

export default Routes;
