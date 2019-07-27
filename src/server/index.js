const Server = require("./server");

// values extracted from the runtime enviorment
const { NODE_ENV, HMR } = process.env;

// instance of the express server class
const server = new Server(NODE_ENV, HMR);

/**
 * Create an instance of the express server. If `process.env.NODE_ENV` is `"production"`,
 * an optimized production build will be instantiated; however if `process.env.NODE_ENV` is
 * `"development"`, a development server will be instantiated. If `HMR` is `"Enabled"`,
 * capabilities for hot module replacement will be added.
 */
server.createApp();

module.exports = server;
