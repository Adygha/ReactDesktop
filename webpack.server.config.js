const THE_PATH = require('path')

module.exports = {
  target: 'node',
  entry: './src/server.ts',
  output: {
    path: THE_PATH.resolve(__dirname, 'build'),
    filename: 'serer-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/i,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/i,
        loader: 'raw-loader'
      },
      {
        test: /\.key$/i,
        loader: 'raw-loader'
      },
      {
        test: /\.crt$/i,
        loader: 'raw-loader'
      }
    ]
  },
  // devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  externals: {
    react: 'require("react")',
    'react-dom': 'require("react-dom")',
    'react-dom/server': 'require("react-dom/server")',
    express: 'require("express")',
    'express-session': 'require("express-session")'
  },
  mode: 'production' // 'none' | 'development' | 'production'
}
