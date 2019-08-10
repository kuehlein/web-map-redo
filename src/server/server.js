const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const morgan = require("morgan");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require("../webpack.dev.config");

// const db = require("./db"); // ! not yet implemented

/**
 * Contains the logic for running the server in both development and production.
 * Instantiated in `server/index.js`.
 */
class Server {
  /**
   * Configuration options for development and production. Chosen based on
   * `process.env.NODE_ENV` in constructor.
   *
   * @param {"development" | "production"} env - current enviornment, `"development"` or `"production"`
   * @returns {{}} either development or production configeration
   */
  static configurations(env) {
    // * Note: You may need sudo to run on port 443
    const configurationOptions = {
      development: { hostname: "localhost", port: 9000, ssl: false },
      production: { hostname: "example.com", port: 443, ssl: true }
    };
    return configurationOptions[env];
  }

  constructor(NODE_ENV = "production", HMR = "enabled") {
    // instance of the express server
    this.app = express();

    // enviornment variable determining type of enviornment, either `"production"` or `"developemnt"`
    this.NODE_ENV = NODE_ENV;

    // If `enabled`, Hot Module Replacement is active. Enable *FOR DEVELOPMENT ONLY*
    this.HMR = HMR;

    // configuration settings being used based on `this.NODE_ENV`
    this.config = Server.configurations(this.NODE_ENV);

    // Create the HTTPS or HTTP server, per configuration
    this.server = this.config.ssl
      ? // * Make sure the files are secured.
        https.createServer(
          {
            cert: fs.readFileSync(path.resolve(__dirname, "ssl", "server.crt")),
            key: fs.readFileSync(path.resolve(__dirname, "ssl", "server.key"))
          },
          this.app
        )
      : http.createServer(this.app);
  }

  /**
   * Based on environment variables, this will invoke and return either
   * `createAppDev` or `createAppProd`.
   */
  createApp() {
    return this.config.ssl ? this.createAppProd() : this.createAppDev();
  }

  /**
   * Creates an instance of the express server for development.
   */
  createAppDev() {
    this.syncDb()
      .then(() => this.appServer())
      .then(() => this.startListening())
      .then(() => this.HMR === "enabled" && this.bundlingMiddleware())
      .then(() => this.webServer())
      .catch(err => console.log(err));
  }

  /**
   * Creates an optimized production instance of the express server.
   */
  createAppProd() {
    this.syncDb()
      .then(() => this.appServer())
      .then(() => this.webServer())
      .catch(err => console.log(err));
  }

  /**
   * Syncs the database to begin the creation of the server.
   */
  syncDb() {
    // db.sync(); // ! not yet implemented

    return Promise.resolve(); // ! hack to make server work
  }

  /**
   * Creates the body of the server. Logging middleware (`morgan`), body parsing
   * middleware (`bodyParser`), compression middleware (`compression`), as well
   * as the api are applied here.
   */
  appServer() {
    this.app.use((req, res, next) => {
      res.set({
        "Access-Control-Allow-Credentials": "same-origin",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "DELETE,GET,PATCH,POST,PUT",
        "Access-Control-Allow-Origin": this.config.hostname
      });
      next();
    });

    // logging middleware
    this.app.use(morgan("dev"));

    // body parsing middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    this.app.use(compression());

    // API - contains `/tree` route
    // this.app.use('/api', require('./api')); // ! not yet implemented

    // Catch all error handling
    this.errorHandlingEndware();
  }

  /**
   * Handles any unhandled errors that have been passed down from `api`.
   */
  errorHandlingEndware() {
    this.app.use((req, res, next, err) => {
      console.error(err);
      console.error(err.stack);
      res
        .status(err.status || 500)
        .send(err.message || "Internal server error.");
    });
  }

  /**
   * Starts listening to the server on `8080`.
   * *DEVELOPMENT ONLY*
   */
  startListening() {
    this.server.listen(this.config.port, () => {
      console.log(`Listening on http://localhost:${this.config.port}`);
    });
  }

  /**
   * Applies `webpack-dev-middleware` and `webpack-hot-middleware`
   * to enable Hot Module Replacement in development.
   *
   * *NOTE* --- Do not use nodemon or anything that restarts server...
   *
   * *DEVELOPMENT ONLY*
   */
  bundlingMiddleware() {
    const compiler = webpack(config);
    this.app.use(
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })
    );
    this.app.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        log: console.log,
        path: ""
      })
    );
  }

  /**
   * Serves the static assets like css and html files.
   */
  webServer() {
    // path to root directory
    const rootDir = ["..", ".."];

    // staticly serve styles
    this.app.use(
      express.static(
        path.join(__dirname, ...rootDir, "src", "client", "main.css")
      )
    );

    // static file-serving middleware then send 404 for the rest (.js, .css, etc.)
    this.app
      .use(express.static(path.join(__dirname, ...rootDir)))
      .use((req, res, next) =>
        path.extname(req.path).length
          ? next(new Error(`404 - Not found: ${req.path}`))
          : next()
      );

    this.app.use("*", (req, res) => {
      // set headers for hot module replacement
      if (this.HMR === "enabled") {
        res.set({
          Connection: "keep-alive",
          "Content-Type": "text/event-stream"
        });
      }

      // sends index.html no matter what
      res.sendFile(path.join(__dirname, ...rootDir, "public", "index.html"));
    });
  }
}

module.exports = Server;
