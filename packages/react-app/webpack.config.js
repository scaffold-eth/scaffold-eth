const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); //to access built-in plugins

module.exports = {
  entry: "./src/index.jsx",
  mode: "development",
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })], // new NamedModulesPlugin()
  module: {
    rules: [
      {
        test: /app\.js$/i,
        loader: "raw-loader",
        // query: {
        //   presets: ["es2015", "react"],
        // },
      },
    ],
  },
  output: {
    path: __dirname,
    filename: "bundle.js",
  },
  resolve: {
    symlinks: false,
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules", path.resolve(__dirname, "app/react-app/")],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      "crypto-browserify": require.resolve("crypto-browserify"), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
  // node: {
  //   Buffer: false,
  //   process: false,
  // },
};
