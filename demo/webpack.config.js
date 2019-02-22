const path = require('path');

module.exports = {
  entry: {
    'helloworker': './src/helloworker.ts',
  },
  /*devtool: 'inline-source-map',*/
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
