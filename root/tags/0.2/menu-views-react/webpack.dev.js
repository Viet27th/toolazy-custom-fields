const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  // It enhances our debugging process
  // Its use to display our original JavaScript while debugging, which is a lot easier to look at than a minified code.
  devtool: "cheap-module-eval-source-map",
  watch: true, // Watch files and recompile whenever they change, https://webpack.js.org/configuration/watch/
  watchOptions: {
    aggregateTimeout: 600,
    poll: 1000, // Check for changes every second
    ignored: /node_modules/
  },
});
