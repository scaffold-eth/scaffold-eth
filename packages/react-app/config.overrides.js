// config-overrides.js
// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = function override(config, env) {
  console.log("override");
  let loaders = config.resolve;
  loaders.fallback = {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
  };
  // disable chunks so the index.html won't change during development
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  config.optimization.runtimeChunk = false;

  config.module.rules = [
    {
      // test: /node_modules\/monaco-editor/,
      use: {
        loader: "babel-loader",
        // if you include your babel config here,
        // you don’t need the `babel.config.json` file
        options: { presets: ["@babel/preset-env"] },
      },
    },
    ...config.module.rules,
  ];

  return config;
};
