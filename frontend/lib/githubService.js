import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}` }
  : {};

/**
 * Fetch repository metadata from GitHub
 */
export async function getRepositoryData(owner, repo) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
}

/**
 * Fetch repository contents to analyze structure
 */
export async function getRepositoryContents(owner, repo, path = '') {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch repository contents: ${error.message}`);
  }
}

/**
 * Fetch commit history
 */
export async function getCommitHistory(owner, repo, perPage = 100) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`,
      {
        headers,
        params: { per_page: perPage }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch commit history: ${error.message}`);
  }
}

/**
 * Fetch languages used in repository
 */
export async function getRepositoryLanguages(owner, repo) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch repository languages: ${error.message}`);
  }
}

/**
 * Fetch README file
 */
export async function getReadme(owner, repo) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
      { headers }
    );
    return {
      content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
      size: response.data.size
    };
  } catch (error) {
    return null;
  }
}

/**
 * Fetch repository releases
 */
export async function getReleases(owner, repo) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`,
      { headers, params: { per_page: 10 } }
    );
    return response.data;
  } catch (error) {
    return [];
  }
}
