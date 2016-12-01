import path from 'path';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import webpackIsomorphicAssets from '../../webpack/assets';
import {isProduction} from './config';

const rootDir = path.resolve(__dirname, '..', '..');

const webpackIsomorphicTools = (
  new WebpackIsomorphicTools(webpackIsomorphicAssets)
    .development(!isProduction)
    .server(rootDir, () => require('./main'))
);

export default webpackIsomorphicTools;
