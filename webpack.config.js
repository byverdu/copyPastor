const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    // react: `${__dirname}/src/index.tsx`,
    // test: path.resolve(__dirname, `src/test/test.tsx`),
    test: `${__dirname}/src/lib/test`,
    // copy: `${__dirname}/src/copy`,
    // world: `${__dirname}/src/world`
  },

  cache: false,

  output: {
    path: __dirname + '/build',
    filename: '[name]/[name].js',
    libraryTarget: 'umd'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  devServer: {
    contentBase: './build'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.join(__dirname, 'node_modules')],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        baseUrl: 'src',
      }),
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'test/test.html',
      // template: '!!prerender-loader?string!src/test.html',
      template: `!!prerender-loader?string&entry=src/lib/test/index.tsx!${path.resolve(__dirname, "src/lib/test", "test.html")}`,

    }),

    // new HtmlWebpackPlugin({
    //   filename: 'copy/copy.html',
    // //   // template: '!!prerender-loader?string!src/copy.html',
    //   template: `!!prerender-loader?string&entry=src/copy.tsx!${path.resolve(__dirname, "src", "copy.html")}`,
    // }),

    new ForkTsCheckerWebpackPlugin()

  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "@teamsupercell/typings-for-css-modules-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              }
            },
          },
          "sass-loader",
        ]
      }
    ]
  }
}
