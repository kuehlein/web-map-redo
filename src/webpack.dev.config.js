const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// path to root directory
const root = ['..'];

// repeated config settings / paths
const exclude = /node_modules/;
const include = path.resolve(__dirname, 'client');

// development plugins
const plugins = [
  new CleanWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ExtractCssChunks({
    chunkFilename: '[id].[hash].css',
    cssModules: true,
    filename: '[name].[hash].css',
    hot: true
  }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...root, 'public', 'favicon.ico'),
    template: path.resolve(__dirname, ...root, 'public', 'index.html')
  })
];

const devConfig = {
  context: path.resolve(__dirname, ...root),
  devtool: 'cheap-module-eval-source-map',
  entry: {
    client: ['webpack-hot-middleware/client', include] // /patch
  },
  mode: 'development',
  module: {
    rules: [
      {
        exclude,
        loader: 'style-loader',
        test: /\.css$/
      },
      {
        exclude,
        loader: 'css-loader',
        options: {
          modules: true
        },
        test: /\.css$/
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../public/assets/media/',
              publicPath: '../public/assets/media/'
            }
          }
        ]
      },
      {
        exclude,
        include,
        loaders: 'babel-loader',
        test: /\.jsx?$/
      },
      {
        enforce: 'pre',
        exclude,
        loader: 'source-map-loader',
        test: /\.js$/
      }
    ]
  },
  optimization: {
    nodeEnv: 'development'
  },
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, ...root, 'public', 'dist'),
    publicPath: '/'
  },
  plugins,
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
    extensions: ['.js', '.jsx', '.jpg', '.png', '.gif', '.svg', '*']
  },
  target: 'web'
};

module.exports = devConfig;
