const path = require("path");

module.exports = (env, argv) =>
  /** @type {import("webpack").Configuration} */ ({
    entry: {
      index: path.join(__dirname, "src", "index.ts"),
    },
    output: {
      path: path.join(__dirname, "www"),
      filename: "PixiGame.js",
      library: "PixiGame",
      libraryTarget: "umd",
    },
    devtool: argv.mode === "development" && "source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
      modules: ["node_modules"],
    },
    devServer: {
      static: path.join(__dirname, "www"),
      client: {
        overlay: {
          warnings: false,
        },
      },
    },
  });
