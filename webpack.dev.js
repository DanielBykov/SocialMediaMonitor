const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

// let staticPath = 'C:\\_Zavy\\1_Dev3\\static\\v5'

module.exports = merge(common, {
  mode: 'development',
  // devtool: 'inline-source-map',
  // devtool: NodeEnvPlugin.devtool,
  // devtool: 'source-map',
  entry: {
    app_v5: './app_v5/src/entryPoint.js',
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
})
