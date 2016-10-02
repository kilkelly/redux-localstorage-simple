'use strict';

var webpack = require('webpack')

module.exports = {

  entry: {
    test: [  
      "./test/test_unpacked.js"
    ]
  },

  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: "babel",                
        exclude: /node_modules/
      }
    ]
  },

  output: {
    //library: 'redux-localstorage-simple',
    //libraryTarget: 'umd',
    filename: "./test/[name].js"
  }

}

