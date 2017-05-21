import ip from 'ip';
import path from 'path';

// env
export const NODE_ENV = process.env.NODE_ENV || 'development';

// paths
const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'));
export const SRC_DIR = path.join(ABSOLUTE_BASE, 'src');
export const BUILD_DIR = path.join(ABSOLUTE_BASE, 'build');

// server
export const SERVER_IP = ip.address();
export const HOT_RELOAD_PORT = process.env.HOT_RELOAD_PORT || 8080;

// app urls
const API_ROOT = 'http://localhost:8000/api';
export const CONTENT_API_ROOT = process.env.CONTENT_API_ROOT || `${API_ROOT}/content`;
export const FORM_API_ROOT = process.env.FORM_API_ROOT || `${API_ROOT}/forms`;

// misc
export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;
