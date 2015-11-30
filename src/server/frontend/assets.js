import config from '../config';
import fs from '../utils/fs';

const DEFAULT = {
  js: 'app.js',
  css: 'app.css',
};

const APP_JS_PATTERN = /^app\-\w+\.js$/;
const APP_CSS_PATTERN = /^app\-\w+\.css$/;

export default async function getAppAssetFilenamesAsync() {
  if (!config.isProduction) {
    return DEFAULT;
  }

  try {
    const buildDirFiles = await fs.readdirAsync('build');
    return {
      js: buildDirFiles.find(filename => APP_JS_PATTERN.test(filename)),
      css: buildDirFiles.find(filename => APP_CSS_PATTERN.test(filename)),
    };
  } catch (e) {
    return DEFAULT;
  }
}
