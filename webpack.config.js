const path = require('path');
const webpack = require('webpack');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const {readDirEntryFiles} = require('./helper');

const ENV = process.env.ENV;
const entryFiles = [
   {
      type: 'script',
      path:'./src/scripts'
   },
   {
      type: 'lib',
      path:'./src/lib'
   },
   {
      type: 'react',
      path: './src/pages'
   },
   {
      type: 'html',
      path: './src/pages'
   }
];

module.exports = function () {
   const outputPath = ENV === 'development' ? __dirname + '/dev-build' :  __dirname + '/build';

   return readDirEntryFiles(entryFiles)
      .then(entries => {
         console.log('webpack =>', entries)
         return {
            mode: ENV,
            entry: {
               ...entries.scripts,
               ...entries.react,
               ...entries.lib,
            },

            cache: false,

            output: {
               path: outputPath,
               filename: 'scripts/[name].js',
               libraryTarget: 'umd'
            },

            // Enable sourcemaps for debugging webpack's output.
            devtool: ENV === 'development' ? 'source-map' : undefined,

            resolve: {
               // Add '.ts' and '.tsx' as resolvable extensions.
               extensions: ['.ts', '.tsx', '.js', '.scss', '.json'],
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
               new CleanWebpackPlugin({
                  cleanStaleWebpackAssets: false,
               }),

               // Webpack plugin that runs TypeScript type checker on a separate process.
               new ForkTsCheckerWebpackPlugin(),

               ...entries.html.map(config       =>  new HtmlWebpackPlugin(config    )),

               new RemovePlugin({
                  after: {
                     root: `${outputPath}/scripts`,
                     include: entries.includeScripts,
                  }
               }),

               new CopyPlugin([
                  {
                     from: 'src/images/*',
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
                        // disabling css modules
                        // 'css-modules-typescript-loader',
                        {
                           loader: 'css-loader',
                           // options: {
                           //    modules: {
                           //       localIdentName: '[name]__[local]--[hash:base64:5]',
                           //    }
                           // },
                        },
                        'sass-loader',
                     ]
                  }
               ]
            }
         }
      })
}