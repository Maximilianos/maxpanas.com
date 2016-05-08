import ip from 'ip';
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import webpackIsomorphicAssets from './assets';
import {
  ABSOLUTE_BASE,
  NODE_MODULES_DIR,
  SRC_DIR,
  BUILD_DIR,
  HOT_RELOAD_PORT,
} from './constants';


/**
 * Generate the necessary loader
 * config for the given styles
 *
 * @param isDevelopment
 * @returns {Array}
 */
function stylesLoaders(isDevelopment) {
  const loaders = {
    css: '',
    scss: '!sass'
  };

  return Object.keys(loaders).map(ext => {
    const prefix = 'css!postcss';
    const extLoaders = prefix + loaders[ext];
    const loader = isDevelopment
      ? `style!${extLoaders}`
      : ExtractTextPlugin.extract('style', extLoaders);

    return {
      loader,
      test: new RegExp(`\\.(${ext})$`)
    };
  });
}


const serverIp = ip.address();
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
    hotPort: HOT_RELOAD_PORT,
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? 'eval-source-map' : false,
    entry: {
      app: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://${serverIp}:${HOT_RELOAD_PORT}/__webpack_hmr`,
        path.join(SRC_DIR, 'browser/index.js')
      ] : [
        path.join(SRC_DIR, 'browser/index.js')
      ]
    },
    module: {
      loaders: [{
        loader: 'url?limit=1',
        test: /\.(gif|jpg|png|svg)$/
      }, {
        loader: 'url?limit=1',
        test: /favicon\.ico$/
      }, {
        loader: 'url?limit=1',
        test: /\.(eot|ttf|woff|woff2)$/
      }, {
        loader: 'babel',
        test: /\.js$/,
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
      }].concat(stylesLoaders(isDevelopment))
    },
    output: isDevelopment ? {
      path: BUILD_DIR,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${serverIp}:${HOT_RELOAD_PORT}/build/`
    } : {
      path: BUILD_DIR,
      filename: '[name]-[hash].js',
      chunkFileName: '[name]-[chunkhash].js',
      publicPath: '/assets/'
    },
    plugins: (() => {
      const plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
            IS_BROWSER: true
          }
        })
      ];
      if (isDevelopment) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
          webpackIsomorphicToolsPlugin.development()
        );
      } else {
        plugins.push(
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
        );
      }
      return plugins;
    })(),
    postcss: () => [autoprefixer({browsers: 'last 2 version'})],
    resolve: {
      extensions: ['', '.js'],
      modulesDirectories: ['src', 'node_modules'],
      root: ABSOLUTE_BASE,
      alias: {
        react$: require.resolve(path.join(NODE_MODULES_DIR, 'react'))
      }
    }
  };
}
