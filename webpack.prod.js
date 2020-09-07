const path              = require('path'),
  SshWebpackPlugin      = require('ssh-webpack-plugin'),
  LiveReloadPlugin      = require('webpack-livereload-plugin'),
  MiniCssExtractPlugin  = require('mini-css-extract-plugin'),
  HtmlWebpackPlugin     = require('html-webpack-plugin'),
  TerserPlugin          = require('terser-webpack-plugin'),
  UglifyJsPlugin        = require('uglifyjs-webpack-plugin'),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  NodeEnvPlugin = require('node-env-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let staticPath = 'C:\\_Zavy\\1_Dev3\\static\\v5'
module.exports = merge(common, {
  mode: 'production',
  entry: {
    app_v5: './app_v5/src/entryPoint.js',
  },
  output: {
    path: staticPath, // C:\_Zavy\1_Dev3\static\v5
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new OptimizeCssAssetsPlugin({
      // assetNameRegExp: /\.optimize\.css$/g,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),

    // new HtmlWebpackPlugin(),
  ],
  optimization: {
    // minimizer: [new TerserPlugin()],
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })],

    // splitChunks: {
    //   chunks: 'all'
    //   }
    // }
  }
})
