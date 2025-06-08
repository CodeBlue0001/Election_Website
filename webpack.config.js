const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './server.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      crypto: false,
      os: false,
      zlib: false
    }
  },
  externals: [
    // Let these stay external (not bundled)
    'mongoose',
    'mongodb',
    'mongodb-client-encryption',
    '@aws-sdk/credential-providers'
  ],
  ignoreWarnings: [
    {
      message: /Critical dependency: the request of a dependency is an expression/
    },
    {
      module: /@aws-sdk\/credential-providers/,
      message: /Module not found/
    },
    {
      module: /mongodb-client-encryption/,
      message: /Module not found/
    }
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
