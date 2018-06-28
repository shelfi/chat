'use strict';

const ExtractTextPlugin             = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin             = require('html-webpack-plugin');
const path                          = require('path');
const preprocess                    = require('preprocess');
const webpack                       = require('webpack');
const WebpackFilePreprocessorPlugin = require('webpack-file-preprocessor-plugin');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const devtool            = 'source-map';
const preprocessContext  = {
  ts : Date.now()
};

const entry = {
  index : [
    'babel-polyfill',
    path.resolve(__dirname, 'src/index.js')
  ]
};

const output = {
    filename: '[name].js',
    path: __dirname + '/dist',
    chunkFilename: '[id].[chunkhash].js'
};

const modules = {
  rules : [
    {
      test : /src.*\.js$/,
      use  : [
        {
          loader : 'ng-annotate-loader'
        },
        {
          loader : 'babel-loader'
        }
      ]
    },
    {
      test: /.html$/,
      loader: 'ngtemplate-loader?relativeTo=' + __dirname +'/src!html-loader?root=' + __dirname + '/src'
    },
    {
        test: /\.(png|jpg|mp3|svg)$/,
        loader: 'url-loader'
    },
    {
      test : /src.*\.(scss|sass)$/,
      use  : ExtractTextPlugin.extract({
        fallback : 'style-loader',
        use      : [
          {
            loader : 'css-loader'
          },
          {
            loader : 'sass-loader'
          },
        ]
      })
    }
  ]
};

const plugins = [
  new ExtractTextPlugin({
    disable  : process.env.NODE_ENV !== 'production',
    filename : '[name].[contenthash].css'
  }),

  /*
  new HtmlWebpackPlugin({
    hash     : true,
    inject   : 'body',
    template : './src/index.html'
  }),
  */

  // Automatically move all modules defined outside of application directory to vendor bundle.
  /*
  new CommonsChunkPlugin({
    minChunks : (module, count) => module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1,
    name      : 'vendor'
  }),
  */

  new WebpackFilePreprocessorPlugin({
    pattern : /index\.html$/,
    process : (source) => preprocess.preprocess(source.toString(), preprocessContext)
  })
];

const resolve = {
  alias            : {
    common : path.resolve(__dirname, 'src/common'),
    pages  : path.resolve(__dirname, 'src/pages')
  },
  descriptionFiles : ['package.json'],
  modules          : ['node_modules']
};

module.exports = {
  devtool,
  entry,
  output,
  module : modules, // Set to not conflict with module from module.exports,
  plugins,
  resolve
};