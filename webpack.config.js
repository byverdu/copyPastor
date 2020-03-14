const path = require('path');
const webpack = require('webpack');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ENV = process.env.ENV;

module.exports = {
  mode: ENV,
  entry: {
    reactPopup: `${__dirname}/src/pages/popup/index.tsx`,
    reactBackground: `${__dirname}/src/pages/background/index.tsx`,
    helper: `${__dirname}/src/lib/helper.ts`,
    logger: `${__dirname}/src/lib/logger.ts`,
    popup: `${__dirname}/src/scripts/popup.ts`,
    background: `${__dirname}/src/scripts/background.ts`
  },

  cache: false,

  output: {
    path: ENV === 'development' ? __dirname + '/dev-build' :  __dirname + '/build',
    filename: 'scripts/[name].js',
    libraryTarget: 'umd'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: ENV === 'development' ? 'source-map' : undefined,

  resolve: {
    alias: {
      style: path.resolve(__dirname, 'src', 'pages/styles')
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.scss'],
    modules: [path.join(__dirname, 'node_modules')],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        baseUrl: 'src'
      }),
    ],
  },

  plugins: [
    new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]),
    new CleanWebpackPlugin(),

    // Webpack plugin that runs TypeScript type checker on a separate process.
    new ForkTsCheckerWebpackPlugin(),

    new HtmlWebpackPlugin({
      excludeChunks: [ 'reactPopup', 'reactBackground', 'background', 'logger', 'helper' ],
      filename: 'static/popup.html',
      template: `!!prerender-loader?string&entry=src/pages/popup/index.tsx!${path.resolve(__dirname, 'src/pages/popup', 'popup.html')}`,
    }),

    new HtmlWebpackPlugin({
      excludeChunks: [ 'reactPopup', 'reactBackground', 'popup', 'logger', 'helper' ],
      filename: 'static/background.html',
      template: `!!prerender-loader?string&entry=src/pages/background/index.tsx!${path.resolve(__dirname, 'src/pages/background', 'background.html')}`,
    }),

    new RemovePlugin({
      after: {
          root: './build/scripts/',
          include: [
              'react.js',
              'reactBackground.js',
              'reactPopup.js'
          ],
      }
  }),

  new CopyPlugin([
    {
      from: 'static/images/*',
      to: './images',
      flatten: true
    },
    {
      from: 'manifest.json',
      to: './'
    }
  ]),

  ],

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              }
            },
          },
          'sass-loader',
        ]
      }
    ]
  }
}
