module.exports = {
  target: "node",
  mode: "development",
  plugins: [new NamedModulesPlugin()],
  rules: [
    {
      test: /config\.json$/,
      loader: "special-loader",
      type: "javascript/auto",
      options: {},
    },
  ],
};
