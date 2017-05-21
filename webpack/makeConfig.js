import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackIsomorphicAssets from './assets';
import {
  NODE_ENV,
  SRC_DIR,
  BUILD_DIR,
  SERVER_IP,
  HOT_RELOAD_PORT,
  CONTENT_API_ROOT,
  FORM_API_ROOT,
  GA_TRACKING_ID
} from './constants';

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
    postcss: [autoprefixer({browsers: 'last 2 version'})],
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          IS_BROWSER: true,
          NODE_ENV: JSON.stringify(NODE_ENV),
          FORM_API_ROOT: JSON.stringify(FORM_API_ROOT),
          CONTENT_API_ROOT: JSON.stringify(CONTENT_API_ROOT),
          GA_TRACKING_ID: JSON.stringify(GA_TRACKING_ID)
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
