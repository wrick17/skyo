module.exports = {
  entry: './public/components/main.js',
  output: {
    filename: 'public/javascripts/script.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  }
};
