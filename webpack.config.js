const path = require( "path" );

module.exports = {
  mode: "production",
  entry: "./src/flatware.js",
  output: {
    path: path.resolve( __dirname, "dist" ),
    filename: "flatware.js",
    globalObject: "this",
    library: "@geronimus/flatware",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "eslint-loader"
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            rootMode: "upward"
          }
        }
      }
    ]
  },
};

