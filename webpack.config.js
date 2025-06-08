const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './server.js',         // Your main server entry
  target: 'node',               // Ensures correct Node.js environment
  mode: 'production',           // Use 'development' for debugging
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  },
  resolve: {
    fallback: {
      // Prevent Webpack from bundling optional Node/AWS SDK dependencies
      '@aws-sdk/credential-providers': false,
      fs: false,
      net: false,
      tls: false,
      dns: false
    }
  },
  ignoreWarnings: [
    {
      module: /@aws-sdk\/credential-providers/,
      message: /Module not found/
    }
  ],
  externals: {
    // Prevent bundling node_modules like MongoDB native modules
    // which are better left external in a Node runtime
    mongodb: 'commonjs mongodb',
    express: 'commonjs express'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // optional if you want to transpile modern JS
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
