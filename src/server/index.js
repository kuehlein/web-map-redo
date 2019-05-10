const Server = require('./server');

const server = new Server();

/**
 * This evaluates to true when executed from the command line and
 * creates an instance of the server for either development or production
 */
if (process.env.NODE_ENV === 'production') {
  server.createAppProd();
} else {
  server.createAppDev();
}

module.exports = server;
