/**
 * Given a pathName, check for equality with `window.location.pathname`.
 *
 * @param {string} pathName name of the path being checked
 * @returns {boolean}
 */
export const isCurrentPath = pathName => pathName === window.location.pathname; // eslint-disable-line no-undef
