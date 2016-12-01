import path from 'path';

// paths
export const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'));

export const SRC_DIR = path.join(ABSOLUTE_BASE, 'src');
export const BUILD_DIR = path.join(ABSOLUTE_BASE, 'build');

// other
export const HOT_RELOAD_PORT = process.env.HOT_RELOAD_PORT || 8080;
