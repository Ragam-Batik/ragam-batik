const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },
    port: 4000,
    hot: true,
    open: {
      target: ['/#/'], 
    },
    
  },
  devtool: 'eval-source-map',
  
});