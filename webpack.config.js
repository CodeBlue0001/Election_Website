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
      '@aws-sdk/credential-providers': false,
      'mongodb-client-encryption': false,
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
  externals: {
    // Prevent bundling native or optional modules
    mongoose: 'commonjs mongoose',
    mongodb: 'commonjs mongodb',
    'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
    '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers'
  },
  ignoreWarnings: [
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
