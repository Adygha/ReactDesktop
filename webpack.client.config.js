const THE_PATH = require('path')

module.exports = {
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
