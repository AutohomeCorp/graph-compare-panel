const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')

var conf = baseWebpackConfig
conf.watch = true
conf.devtool = 'source-map'

const webpackConfig = merge(conf, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('dev')
      }
    })
  ]
})
module.exports = webpackConfig
