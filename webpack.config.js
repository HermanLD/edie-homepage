const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => {
  const isDevMode = env.production != true;
  const config = {
    mode: isDevMode ? "development" : "production",
    entry: "./src/js/main.js",
    output: {
      filename: "js/bundle.js",
      path: resolve(__dirname, "dist"),
      //* Custom output filename for Asset Module
      assetModuleFilename: "assets",
      //* Cleans dist folder on production build
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: ["html-loader"],
        },
        {
          test: /\.css$/i,
          use: [
            isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { importLoaders: 1 },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["autoprefixer"]],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "css/styles.css",
      }),
    ],
    optimization: {
      //? Only runs in production
      minimize: !isDevMode,
      minimizer: [new HtmlMinimizerPlugin(), new CssMinimizerPlugin()],
    },
  };

  return config;
};
