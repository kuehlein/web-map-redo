const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { optimize } = require("webpack");

// path to root directory
const rootDir = [".."];

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, "client");

// production plugins
const plugins = [
  new optimize.ModuleConcatenationPlugin(),
  new MiniCssExtractPlugin({
    chunkFilename: "[id].[hash].css",
    filename: "[name].[hash].css"
  }),
  new OptimizeCssAssetsPlugin({})
];
const minimizer = [
  new TerserPlugin({
    exclude,
    include,
    parallel: true,
    terserOptions: {
      ecma: undefined,
      warnings: false,
      parse: {},
      compress: {},
      mangle: true,
      module: false,
      output: null,
      toplevel: false,
      nameCache: null,
      ie8: false,
      keep_classnames: undefined,
      keep_fnames: false,
      safari10: false
    },
    test: /\.jsx?$/
  })
];

const prodConfig = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-source-map",
  entry: include,
  mode: "production",
  module: {
    rules: [
      {
        exclude,
        loader: MiniCssExtractPlugin.loader,
        options: {},
        test: /\.css$/
      },
      {
        exclude,
        loader: "css-loader",
        test: /\.css$/
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "../public/assets/media/",
              publicPath: "../public/assets/media/"
            }
          }
        ]
      },
      {
        exclude,
        include,
        loaders: "babel-loader",
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
    minimizer
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, ...rootDir, "public", "dist")
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx", ".jpg", ".png", ".gif", ".svg", "*"]
  },
  target: "web"
};

module.exports = prodConfig;
