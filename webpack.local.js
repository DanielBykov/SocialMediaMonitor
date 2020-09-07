const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

console.log('LOCAL: ',)

module.exports = merge(common, {
  mode: 'development',
  // devtool: 'source-map',
  // devtool: 'inline-source-map',
  // devtool: NodeEnvPlugin.devtool,
  devServer: {
    contentBase: './dist',
    proxy: {
      '/api': {
        target: 'https://dev3.zavy.co',
        // pathRewrite: {'^/api' : ''},
        secure: false,
        changeOrigin: true
      },
    }
  },
  output: {
    // path: staticPath, // C:\_Zavy\1_Dev3\static\v5
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  }
})

