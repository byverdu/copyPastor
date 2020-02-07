const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  mode: "development",
  entry: {
    react: `${__dirname}/src/index.tsx`,
    hello: `${__dirname}/src/hello`,
    world: `${__dirname}/src/world`
  },

  output: {
    path: __dirname + '/build',
    filename: '[name]/[name].js',
    libraryTarget: 'umd'
  },

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       helloStyles: {
  //         name: 'hello',
  //         test: (m, c, entry = 'hello') =>
  //           m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //       worldStyles: {
  //         name: 'world',
  //         test: (m, c, entry = 'world') =>
  //           m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //     },
  //   },
  // },

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
    new StaticSiteGeneratorPlugin({
      globals: {
        window: {}
      },
      entry: 'react',
      paths: [
        'hello',
        'world'
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name]/[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]/[name].css',
            }
          },
          "sass-loader"
        ]
      }
    ]
  }
}
