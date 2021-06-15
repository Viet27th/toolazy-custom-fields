const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        // https://www.robinwieruch.de/webpack-eslint
        // To use ESLint in Webpack while bundle.
        enforce: "pre",
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              [
                // This plugin to enable to use asyn/await
                // https://stackoverflow.com/questions/52157572/webpack-4-babel-7-transform-runtime-invalid-configuration-object
                "@babel/plugin-transform-runtime",
                {
                  "regenerator": true
                }
              ],
              "@babel/plugin-syntax-dynamic-import", // Allow Babel can parse the dynamic import syntax but is not transforming it
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
