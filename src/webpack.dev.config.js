const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

// path to root directory
const rootDir = [".."];

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, "client");

// development plugins
const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  // new ExtractCssChunks({
  //   chunkFilename: "[id].[hash].css",
  //   cssModules: true,
  //   filename: "[name].[hash].css",
  //   hot: true
  // }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  })
  // new webpack.DefinePlugin({})
];

// optimization configuration for code splitting
const splitChunks = {
  chunks: "async"
};

const devConfig = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "inline-source-map", // "cheap-module-eval-source-map",
  entry: {
    client: ["webpack-hot-middleware/client", include] // /patch
  },
  mode: "development",
  module: {
    rules: [
      {
        exclude,
        include,
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: "css-loader",
            options: {
              // modules: true, // ! why is this breaking things...
              camelCase: true,
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "assets/media/",
          publicPath: "../public/assets/media/"
        },
        test: /\.(jpg|png|gif|svg)$/
      },
      {
        exclude,
        include,
        loader: "babel-loader",
        test: /\.jsx?$/
      },
      {
        enforce: "pre",
        exclude,
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  optimization: {
    nodeEnv: "development",
    splitChunks
  },
  output: {
    chunkFilename: "[name].[hash].js",
    filename: "[name].[hash].bundle.js",
    publicPath: "/"
  },
  plugins,
  resolve: {
    alias: { "react-dom": "@hot-loader/react-dom" },
    extensions: [".js", ".jsx", ".jpg", ".png", ".gif", ".svg", "*"]
  },
  target: "web"
};

module.exports = devConfig;
