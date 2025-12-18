import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

export async function getRepositoryData(owner, repo) {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
}

export async function getRepositoryContents(owner, repo, path = '') {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, { headers });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository contents: ${error.message}`);
  }
}

export async function getCommitHistory(owner, repo, perPage = 100) {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`, {
      headers,
      params: { per_page: perPage }
    });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch commit history: ${error.message}`);
  }
}

export async function getRepositoryLanguages(owner, repo) {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository languages: ${error.message}`);
  }
}

export async function getReadme(owner, repo) {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, { headers });
    return {
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
      size: data.size
    };
  } catch {
    return null;
  }
}

export async function getReleases(owner, repo) {
  try {
    const { data } = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`, { headers, params: { per_page: 10 } });
    return data;
  } catch {
    return [];
  }
}
