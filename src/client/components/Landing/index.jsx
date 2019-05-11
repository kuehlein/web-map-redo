// ! move the `hot` wrapper to whichever component is being worked on
import { hot } from 'react-hot-loader/root';

import React from 'react';

/**
 * Landing page...
 *
 * @returns {*} ReactElement<any>
 */
const Landing = () => (
  <div>
    <hr />
    <h2 style={{ backgroundColor: 'cyan' }}>Landing</h2>
  </div>
);

export default hot(Landing);
