const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const modeConfiguration = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode } = { mode: "development" }) => {
  console.log(`mode is: ${mode}`);

  return merge({
    mode: "development",
    entry: "./src/index.jsx",
    devServer: {
      compress: true,
      hot: true,
      open: true,
    },
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    resolve: {
      extensions: [".js", ".jsx"],
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
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};
