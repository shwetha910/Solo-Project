const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    src: './client/index.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  //mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {  
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
          },
        },
      },
      { 
        test: /\.s?css/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html'
    }),
  ],
  devServer: {
    static : {
      publicPath: '/build',
      directory: path.resolve(__dirname, 'build'),

    },
    proxy:{
        '/api': 'http://localhost:3000'
      }
  }
};
