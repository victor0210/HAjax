const path = require('path')

const resolve = (rp) => {
  return path.resolve(__dirname, rp)
}

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /(\.js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'utils': resolve('src/utils'),
      'config': resolve('src/config')
    },
    extensions: ['.ts', '.js']
  }
}
