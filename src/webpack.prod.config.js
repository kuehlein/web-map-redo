const CleanWebpackPlugin = require("clean-webpack-plugin");
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
  new CleanWebpackPlugin(),
  new optimize.ModuleConcatenationPlugin(),
  new MiniCssExtractPlugin({
    chunkFilename: "[id].[hash].css",
    filename: "[name].[hash].css"
  }),
  new OptimizeCssAssetsPlugin({})
];

// optimization configuration for minimizing code
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

// optimization configuration for code splitting
const splitChunks = {
  chunks: "async", // "all"
  minSize: 30000,
  maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
};

const prodConfig = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-source-map",
  entry: include,
  mode: "production",
  module: {
    rules: [
      {
        exclude,
        include,
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              camelCase: true
            }
          },
          "sass-loader"
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
        loaders: "babel-loader",
        test: /\.jsx?$/
      }
    ]
  },
  optimization: {
    minimizer,
    splitChunks
  },
  output: {
    chunkFilename: "[name].[hash].js",
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
