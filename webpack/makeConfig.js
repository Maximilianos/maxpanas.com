import ip from 'ip';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackIsomorphicAssets from './assets';
import {SRC_DIR, BUILD_DIR, HOT_RELOAD_PORT} from './constants';


const SERVER_IP = ip.address();

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets);


/**
 * Generate the webpack config
 * object
 *
 * @param isDevelopment
 * @returns {*}
 */
export default function makeConfig(isDevelopment) {
  return {
    /**
     * Development options
     */
    hotPort: HOT_RELOAD_PORT,
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment && 'source-map',

    /**
     * Entry
     */
    entry: {
      app: (
        isDevelopment
          ? [`webpack-hot-middleware/client?path=http://${SERVER_IP}:${HOT_RELOAD_PORT}/__webpack_hmr`]
          : []
      ).concat(path.join(SRC_DIR, 'browser/index.js'))
    },

    /**
     * Output
     */
    output: {
      path: BUILD_DIR,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: (
        isDevelopment
          ? `http://${SERVER_IP}:${HOT_RELOAD_PORT}/build/`
          : '/assets/'
      )
    },

    /**
     * Loaders
     */
    module: {
      loaders: [
        // image loader
        {
          test: /\.(gif|jpe?g|png|svg|ico)$/,
          loader: 'url?limit=1'
        },

        // font loader
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'url?limit=1',
        },

        // css loaders
        {
          test: /\.(css|scss)/,
          loader: (
            isDevelopment
              ? 'style!css!postcss!sass'
              : ExtractTextPlugin.extract('style', 'css!postcss!sass')
          )
        },

        // javascript loader
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            plugins: ['transform-runtime', 'add-module-exports'],
            presets: ['es2015', 'react', 'stage-1'],
            env: {
              development: {
                presets: ['react-hmre']
              }
            }
          }
        }
      ]
    },

    /**
     * Plugins
     */
    postcss: [
      autoprefixer({browsers: 'last 2 version'})
    ],
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
          IS_BROWSER: true
        }
      })
    ].concat(
      isDevelopment ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        webpackIsomorphicToolsPlugin.development()
      ] : [
        new ExtractTextPlugin('app-[hash].css', {
          allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          comments: false,
          screw_ie8: true,
          compress: {
            drop_console: true,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: false
          }
        }),
        webpackIsomorphicToolsPlugin
      ]
    )
  };
}
