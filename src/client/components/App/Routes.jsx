import loadable from '@loadable/component';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Landing } from '..';

/**
 * Client-Side Routing (CSR) component. Index of various routes in the app.
 *
 * @returns {*} ReactElement<any>
 */
const Routes = () => {
  // loadable used for code splitting // ! not yet implemented
  // const LGetInvolved = loadable(() => import("../GetInvolved"));
  // const LPlanters = loadable(() => import("../Planters"));
  // const LSupport = loadable(() => import("../Support"));
  // const LExplore = loadable(() => import("../Explore"));
  // const LAbout = loadable(() => import("../About"));
  // const LContact = loadable(() => import("../Contact"));

  return (
    <Switch>
      {/* Displays our Landing component as a fallback */}
      {/* ! not yet implemented...
      <Route path="/get-involved" render={<LGetInvolved />} />
      <Route path="/planters" render={<LPlanters />} />
      <Route path="/support" render={<LSupport />} />
      <Route path="/explore" render={<LExplore />} />
      <Route path="/about" render={<LAbout />} />
      <Route path="/about" render={<LContact />} />
      */}
      <Route path="/" component={Landing} />
    </Switch>
  );
};

export default Routes;
