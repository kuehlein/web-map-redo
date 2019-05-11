import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../../../public/assets/media/logo.png'; // ! temp...
import { MButton } from '../Materials';

/**
 * Navbar. Rendered at the top of the main `App` component. Contains navigation options.
 *
 * @returns {*} ReactElement<any>
 */
const Navbar = () => (
  <Fragment>
    <h2>
      <Link disabled={window.location.pathname === '/'} to="/">
        <img style={{ height: '2em' }} src={logo} alt="logo" />
      </Link>
    </h2>
    <div>
      <MButton
        disabled={window.location.pathname === '/get-involved'}
        name="Get Involved"
        redirect="get-involved"
      />
      <MButton
        disabled={window.location.pathname === '/planters'}
        name="Tree Planters"
        redirect="planters"
      />
      <MButton
        disabled={window.location.pathname === '/support'}
        name="Support"
        redirect="support"
      />
      <MButton
        disabled={window.location.pathname === '/explore'}
        name="Explore the Trees"
        redirect="explore"
      />
      <MButton
        disabled={window.location.pathname === '/about'}
        name="About Greenstand"
        redirect="about"
      />
      <MButton
        disabled={window.location.pathname === '/contact'}
        name="Contact"
        redirect="contact"
      />
    </div>
  </Fragment>
);

export default Navbar;
