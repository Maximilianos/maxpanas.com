import path from 'path';

// paths
export const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'));
export const NODE_MODULES_DIR = path.join(ABSOLUTE_BASE, 'node_modules');
export const SRC_DIR = path.join(ABSOLUTE_BASE, 'src');
export const DIST_DIR = path.join(ABSOLUTE_BASE, 'dist');
export const BUILD_DIR = path.join(ABSOLUTE_BASE, 'build');
export const ASSETS_DIR = path.join(ABSOLUTE_BASE, 'assets');

// other
export const HOSTNAME = 'localhost';
export const HOT_RELOAD_PORT = process.env.HOT_RELOAD_PORT || 8080;
