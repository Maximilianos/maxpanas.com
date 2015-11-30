import path from 'path';
import webpack from 'webpack';

import {
  ABSOLUTE_BASE,
  NODE_MODULES_DIR,
  SRC_DIR,
  BUILD_DIR,
  HOSTNAME,
  HOT_RELOAD_PORT,
} from './constants';

const devtools = process.env.CONTINUOUS_INTEGRATION
  ? 'inline-source-map'
  : 'cheap-module-eval-source-map';

export default function getConfig(isProduction) {
  const isDevelopment = !isProduction;

  function pluginsToUse() {
    const plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
          IS_BROWSER: true,
        },
      }),
    ];

    if (isDevelopment) {
      plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      );
    } else {
      plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          comments: false,
          compress: {
            drop_console: true,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: false,
          },
        })
      );
    }

    return plugins;
  }

  return {
    hotPort: HOT_RELOAD_PORT,
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? devtools : '',
    entry: {
      app: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://${HOSTNAME}:${HOT_RELOAD_PORT}/__webpack_hmr`,
        path.join(SRC_DIR, 'app/client.js'),
      ] : [
        path.join(SRC_DIR, 'app/client.js'),
      ],
    },
    module: {
      loaders: [{
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url',
        query: {
          limit: 100000,
        },
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          stage: 0,
          env: {
            development: {
              plugins: ['react-transform'],
              extra: {
                'react-transform': {
                  transforms: [{
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module'],
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react'],
                  }],
                },
              },
            },
          },
        },
      }],
    },
    output: isDevelopment ? {
      path: BUILD_DIR,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${HOSTNAME}:${HOT_RELOAD_PORT}/build/`,
    } : {
      path: BUILD_DIR,
      filename: '[name]-[hash].js',
      chunkFileName: '[name]-[chunkhash].js',
    },
    plugins: pluginsToUse(),
    resolve: {
      extensions: ['', '.js', '.json'],
      modulesDirectories: ['src', 'node_modules'],
      root: ABSOLUTE_BASE,
      alias: {
        'react$': require.resolve(path.join(NODE_MODULES_DIR, 'react')),
      },
    },
  };
}
