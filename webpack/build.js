import gutil from 'gulp-util';
import webpack from 'webpack';

import makeWebpackConfig from './makeConfig';

export default function build(callback) {
  const config = makeWebpackConfig(true);
  webpack(config, (fatalError, stats) => {
    const jsonStats = stats.toJson();
    const buildError = fatalError
      || jsonStats.errors[0]
      || jsonStats.warnings[0];

    if (buildError) {
      throw new gutil.PluginError('webpack', buildError);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    }));

    callback();
  });
}
