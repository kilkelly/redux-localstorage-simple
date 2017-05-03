'use strict'

module.exports = {

  entry: {
    test: [
      './test/test_.js'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },

  output: {
    // library: 'redux-localstorage-simple',
    // libraryTarget: 'umd',
    filename: './test/[name].js'
  }

}

