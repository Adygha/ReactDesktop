const THE_PATH = require('path')
const NodemonPlugin = require('nodemon-webpack-plugin')

const serverConfig = {
  plugins: [
    new NodemonPlugin({
      script: './build/serer-bundle.js',
      ignore: ['*.js.map'],
      watch: ['./build', './www/js'],
      ext: 'js'
    })
  ],
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

const clientConfig = {
  target: 'web',
  entry: './src/view/react/react-browser.tsx',
  output: {
    path: THE_PATH.resolve(__dirname, 'www/js'),
    filename: 'client-bundle.js'
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
      }
    ]
  },
  // devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  // externals: { // Butter keep them in bundle
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  mode: 'production' // 'none' | 'development' | 'production'
}

// const nodemonConfig = {
//   plugins: [
//     new NodemonPlugin()
//   ]
// }

module.exports = [serverConfig, clientConfig]
