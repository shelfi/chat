const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//const argv.mode = process.env.NODE_ENV !== 'production';

module.exports = (env, argv) => {
  console.log(argv.mode);
  return {
  entry: './src/index.js',
    output: {
      filename: 'sfchat.min.js',
      path: __dirname + '/dist'
    },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
  	  {
  	  test: /\.(sa|sc|c)ss$/,
  	  use: [
          //(argv.mode !== 'production') ? 'style-loader' : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
          (argv.mode !== 'production') ? 'style-loader' : 'style-loader', // creates style nodes from JS strings
  		    {
  		      loader: "css-loader" // translates CSS into CommonJS
  		    },
  		    {
  		      loader: "sass-loader" // compiles Sass to CSS
  		    },
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                  browsers: ["last 2 versions"]
              },
              plugins: () => [
                  autoprefixer
              ]
            }
          }
  		  ]
  		},
      {
          test: /\.(png|jpg|mp3|svg)$/,
          loader: 'url-loader'
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      publicPath: './dist',
      filename: argv.mode ? '[name].css' : '[name].[hash].css',
      chunkFilename: argv.mode ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': 'http://192.168.0.12:3000'
    }
  },
  node: {
    buffer: false
  }
  }
};