/* eslint-disable no-console */

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const path = require("path");

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
  }
};

const css = ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', postcss, 'sass-loader'],
              });

module.exports = {
  entry: './public/javascript/main.js',
  output: {
    path: path.resolve(__dirname, "public", "dist"),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(s+(a|c)ss|css)$/,
        use: css
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: 'file-loader?name=images/[name].[ext]'
      }
    ]
  },
  devServer: {
    compress: true,
    stats: "errors-only",
    open: false,
    overlay: true,
    port: 8080,
  },
  plugins: [
    new ExtractTextPlugin({
       filename: 'style.css',
       allChunks: true,
     }),
  ]
};

process.noDeprecation = true;

// https://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
