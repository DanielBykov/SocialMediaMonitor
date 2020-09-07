const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    app_v5: './src/entryPoint.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'css/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

  ],
  module: {
    rules: [
      { //0
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      { //1
        test: /\.(css|sass)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            // options: {sourceMap: true,}
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          { // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap:true,
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            // options: {
            //   plugins: [
            //
            //   ]
            // }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              // outputStyle: 'compressed',
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // name: '[path][name].[ext]',
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(eot|woff2|woff|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // name: '[path][name].[ext]',
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ]
  },
  stats: {colors: true},
}



