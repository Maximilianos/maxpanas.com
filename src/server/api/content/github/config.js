const GITHUB_API = 'https://api.github.com';

// Github user api base
export const USERS_API = `${GITHUB_API}/users`;

// Github repo related api bases
const USER = 'Maximilianos';
const REPO = 'articles';

export const ARTICLES_BASE_DIR = 'articles';

const REPOS_API = `${GITHUB_API}/repos`;
const REPO_API = `${REPOS_API}/${USER}/${REPO}`;

export const REPO_CONTENT_API = `${REPO_API}/contents`;
export const REPO_COMMITS_API = `${REPO_API}/commits`;
