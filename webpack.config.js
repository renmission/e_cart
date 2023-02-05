// node.js inbuilt libarary
// no need to install
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Old Javascript Technique to Export content
module.exports = {
  entry: './src/index.jsx',
  output: { path: path.resolve(__dirname, 'dist'), filename: 'main.js' },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        // sequance should be right to left
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    compress: true,
    port: 8080,
    open: true,
  },
};
