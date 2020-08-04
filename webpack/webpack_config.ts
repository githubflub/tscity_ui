import path from 'path'
import { mergeWith } from 'lodash'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import jsonImporter from 'node-sass-json-importer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SitemapWebpackPlugin from 'sitemap-webpack-plugin';

import babel_config from './babel_config'
import mergeWebpackConfigs from './mergeWebpackConfigs'
import environment_variables from './environment_variables'

const NODE_ENV = process.env.NODE_ENV
const STACK_ENV = process.env.STACK_ENV
const SITE_URL = process.env.SITE_URL
const root = path.resolve(__dirname, '..')

const site_paths = [
   '/chat/',
]

console.log("your node env", NODE_ENV)

const base_webpack_config = {
   resolve: {
      extensions: ['*', ".ts", ".tsx", '.mjs', '.js', '.jsx', '.json'],
      modules: [path.resolve(root, 'src'), 'node_modules'],
   },
   output: {
      path: path.resolve(root, 'dist'),

      // Public path refers to the location from the _browser's_ perspective, so
      // `/public' would be referring to `mydomain.com/public/` instead of just
      // `mydomain.com`.
      publicPath: '/',
   },
   plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(environment_variables),
      new HtmlWebpackPlugin({
         template: 'src/index.ejs',
         favicon: 'src/favicon.ico',
      }),
      new PreloadWebpackPlugin({
         fileWhitelist: [/\.css/]
      }),
      new MiniCssExtractPlugin({
         filename: '[name].[hash].css',
         chunkFilename: '[id].[contenthash].css',
      }),
      new CopyWebpackPlugin([
         {
            from: 'src/robots.txt'
         }
      ]),
      new SitemapWebpackPlugin(SITE_URL, site_paths)
   ],
   module: {
      rules: [

         // Babel
         {
            test: /\.(t|j)sx?$/,
            exclude: {
               test: path.resolve(root, 'node_modules'),
               exclude: /[\S]*(node_modules\/@tscity\/[^ \/]*\/(?!node_modules)[\S]*)$/
            },
            use: [
               {
                  loader: 'babel-loader',
                  options: babel_config,
               },
            ]
         },

         {
            test: /(\.css|\.scss|\.sass)$/,
            use: [
               !(NODE_ENV === 'production')? 'style-loader' : {
                  loader: MiniCssExtractPlugin.loader,
                  // options: {
                  //    hmr: process.env.NODE_ENV !== 'production',
                  //    // reloadAll: true,
                  // }
               },
               {
                  loader: 'css-loader',
                  options: {
                     sourceMap: (NODE_ENV === 'production' && STACK_ENV === 'prod')? false : true,
                     importLoaders: 1, // Number of loaders applied before css-loader (only sass-loader => 1)
                  }
               },
               {
                  loader: 'sass-loader',
                  options: {
                     importer: jsonImporter(),
                  }
               }
            ]
         },

         // Images (jpg, png, etc)
         {
            test: /\.(jpe?g|png|gif)$/i,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[hash].[ext]'
                  }
               }
            ]
         },

         // Ico
         {
            test: /\.ico$/i,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]'
                  }
               }
            ]
         },

         // Video
         {
            test: /\.(mp4|webm)(\?.*)?$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[hash].[ext]'
                  }
               }
            ]
         },

         // Scalable Web Graphics
         {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: [
               {
                  loader: 'url-loader',
                  options: {
                     fallback: 'file-loader',
                     limit: 1000,
                     mimetype: 'image/svg+xml'
                  }
               }
           ]
         }


      ]

   }
}

const local_webpack_config = {
   mode: 'development',
   devtool: 'cheap-module-eval-source-map',
   entry: [
      path.resolve(root, 'src', 'main.jsx')
   ],
   output: {
      filename: '[name].bundle.js',
   },

   plugins: [
      new webpack.HotModuleReplacementPlugin()
   ],

}

const live_webpack_config = {
   mode: 'production',

   entry: [
      path.resolve(root, 'src', 'main.jsx')
   ],

   output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].bundle.js',
   },

   optimization: {
      minimizer: [new TerserWebpackPlugin({ sourceMap: true }), new OptimizeCSSAssetsPlugin({})],
      splitChunks: {
         chunks: 'all',
         // name: false, // Recommended for production builds
       },
   },

   plugins: [
      new webpack.SourceMapDevToolPlugin({
         append: STACK_ENV === 'prod'? '\n//# sourceMappingURL=http://localhost:5050/uiprod/[url]' : '\n//# sourceMappingURL=http://localhost:5050/uidev/[url]',
         filename: '[file].map'
      }),
   ],
}


const webpack_config = mergeWith(
   {},
   base_webpack_config,
   process.env.NODE_ENV === 'production'? live_webpack_config : local_webpack_config,
   mergeWebpackConfigs,
)

export default webpack_config;