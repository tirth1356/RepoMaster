import {
  getRepositoryData,
  getRepositoryContents,
  getCommitHistory,
  getRepositoryLanguages,
  getReadme,
  getReleases
} from './githubService.js';

/**
 * Main function to analyze a GitHub repository by URL
 */
export async function analyzeRepositoryLogic(url) {
  // Extract owner and repo from URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repository URL');

  const owner = match[1];
  const repo = match[2];

  // Fetch all repository data
  const [repoData, contents, commits, languages, readme, releases] = await Promise.all([
    getRepositoryData(owner, repo),
    getRepositoryContents(owner, repo),
    getCommitHistory(owner, repo),
    getRepositoryLanguages(owner, repo),
    getReadme(owner, repo),
    getReleases(owner, repo)
  ]);

  // Calculate scores
  const scores = calculateScores(repoData, contents, commits, languages, readme, releases);

  return {
    score: scores.overall,
    level: getLevel(scores.overall),
    scores,
    summary: generateSummary(scores, repoData, readme),
    roadmap: generateRoadmap(scores),
    metadata: {
      name: repoData.name,
      url: repoData.html_url,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language
    }
  };
}

/**
 * Calculate evaluation scores
 */
function calculateScores(repoData, contents, commits, languages, readme, releases) {
  const scores = {
    documentation: calculateDocumentationScore(readme, repoData),
    structure: calculateStructureScore(contents),
    commits: calculateCommitScore(commits),
    languages: calculateLanguageScore(languages),
    community: calculateCommunityScore(repoData),
    testing: calculateTestingScore(contents),
    versioning: calculateVersioningScore(releases, commits),
    overall: 0
  };

  scores.overall = Math.round(
    scores.documentation * 0.2 +
    scores.structure * 0.15 +
    scores.commits * 0.15 +
    scores.languages * 0.1 +
    scores.community * 0.15 +
    scores.testing * 0.15 +
    scores.versioning * 0.1
  );

  return scores;
}

/**
 * Scoring helpers
 */
function calculateDocumentationScore(readme, repoData) {
  let score = 0;
  if (readme) {
    const content = readme.content.toLowerCase();
    const size = readme.size;
    score += Math.min(50, (size / 500) * 50);
    if (content.includes('install') || content.includes('setup')) score += 10;
    if (content.includes('usage') || content.includes('example')) score += 10;
    if (content.includes('license')) score += 5;
    if (content.includes('contribut')) score += 5;
  }
  if (repoData.license) score += 10;
  return Math.min(100, score);
}

function calculateStructureScore(contents) {
  let score = 50;
  if (!Array.isArray(contents)) return score;
  const fileNames = contents.map(f => f.name.toLowerCase());
  if (fileNames.some(n => n === 'src')) score += 10;
  if (fileNames.some(n => n === 'tests' || n === 'test')) score += 10;
  if (fileNames.some(n => n === 'docs' || n === 'documentation')) score += 5;
  if (fileNames.some(n => n === '.gitignore')) score += 5;
  if (fileNames.some(n => n === 'package.json' || n === 'setup.py' || n === 'go.mod')) score += 10;
  return Math.min(100, score);
}

function calculateCommitScore(commits) {
  if (!Array.isArray(commits) || commits.length === 0) return 20;
  let score = 0;
  if (commits.length >= 50) score += 20;
  else if (commits.length >= 20) score += 15;
  else if (commits.length >= 10) score += 10;
  else score += 5;

  const meaningfulCommits = commits.filter(c => {
    const msg = c.commit.message.toLowerCase();
    const length = c.commit.message.length;
    return length > 10 && !msg.startsWith('wip') && !msg.startsWith('temp');
  }).length;

  score += (meaningfulCommits / commits.length) * 60;

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentCommits = commits.filter(c => new Date(c.commit.author.date) > threeMonthsAgo);
  if (recentCommits.length > 0) score += 20;

  return Math.min(100, score);
}

function calculateLanguageScore(languages) {
  if (!languages || Object.keys(languages).length === 0) return 30;
  const languageCount = Object.keys(languages).length;
  let score = 0;
  if (languageCount >= 2) score += 30;
  if (languageCount >= 3) score += 20;

  const goodLanguages = ['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'c++'];
  if (Object.keys(languages).some(lang => goodLanguages.some(g => lang.toLowerCase().includes(g)))) score += 40;

  return Math.min(100, score);
}

function calculateCommunityScore(repoData) {
  let score = 0;
  if (repoData.stargazers_count >= 100) score += 30;
  else if (repoData.stargazers_count >= 10) score += 20;
  else if (repoData.stargazers_count > 0) score += 10;

  if (repoData.forks_count >= 10) score += 20;
  else if (repoData.forks_count > 0) score += 10;

  if (repoData.watchers_count >= 10) score += 15;
  if (repoData.open_issues_count < 20) score += 10;
  if (repoData.description && repoData.description.length > 20) score += 15;

  return Math.min(100, score);
}

function calculateTestingScore(contents) {
  let score = 30;
  if (!Array.isArray(contents)) return score;
  const allFiles = contents.map(f => f.name.toLowerCase()).join(' ');
  const testIndicators = ['test','spec','coverage','jest','mocha','pytest','unittest','gotest'];
  if (testIndicators.some(ind => allFiles.includes(ind))) score += 70;
  return Math.min(100, score);
}

function calculateVersioningScore(releases, commits) {
  let score = 30;
  if (Array.isArray(releases) && releases.length > 0) {
    if (releases.length >= 5) score += 40;
    else if (releases.length >= 2) score += 30;
    else score += 20;
    if (releases.filter(r => /^\d+\.\d+\.\d+/.test(r.tag_name)).length > 0) score += 10;
  }
  return Math.min(100, score);
}

function getLevel(score) {
  if (score >= 75) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  return 'Beginner';
}

function generateSummary(scores, repoData, readme) {
  const level = getLevel(scores.overall);
  const strengths = [];
  const improvements = [];

  if (scores.documentation >= 70) strengths.push('comprehensive documentation');
  if (scores.commits >= 70) strengths.push('consistent commit history');
  if (scores.community >= 70) strengths.push('good community engagement');
  if (scores.testing >= 70) strengths.push('solid test coverage');

  if (scores.documentation < 50) improvements.push('improve README with setup and usage instructions');
  if (scores.testing < 50) improvements.push('add unit and integration tests');
  if (scores.commits < 50) improvements.push('establish more consistent commit practices');
  if (scores.structure < 50) improvements.push('better organize project structure');
  if (scores.versioning < 50) improvements.push('create releases and version tags');

  let summary = `This ${repoData.language || 'general'} repository demonstrates a ${level.toLowerCase()}-level project. `;
  if (strengths.length) summary += `Strengths include: ${strengths.join(', ')}. `;
  if (improvements.length) summary += `To improve, focus on: ${improvements.slice(0,2).join(' and ')}. `;
  else summary += `This is a well-maintained project with good practices applied. `;
  summary += `The repository has ${repoData.stars || repoData.stargazers_count} stars and reflects ${repoData.language || 'mixed'} language usage.`;
  return summary;
}

function generateRoadmap(scores) {
  const roadmap = [];
  if (scores.documentation < 70) roadmap.push({
    priority: 'High',
    title: 'Improve Documentation',
    description: 'Enhance README with setup, usage, and contribution instructions',
    impact: 'Helps users understand and use your project'
  });
  if (scores.testing < 70) roadmap.push({
    priority: 'High',
    title: 'Add Test Coverage',
    description: 'Write unit and integration tests',
    impact: 'Ensures code quality'
  });
  if (scores.commits < 70) roadmap.push({
    priority: 'Medium',
    title: 'Improve Commit Practices',
    description: 'Write meaningful commit messages',
    impact: 'Makes history cleaner'
  });
  if (scores.structure < 70) roadmap.push({
    priority: 'Medium',
    title: 'Organize Project Structure',
    description: 'Create directories like /src, /tests, /docs',
    impact: 'Improves maintainability'
  });
  if (scores.versioning < 70) roadmap.push({
    priority: 'Medium',
    title: 'Implement Versioning',
    description: 'Create releases and use semantic versioning',
    impact: 'Helps users track changes'
  });
  if (scores.community < 70) roadmap.push({
    priority: 'Low',
    title: 'Increase Community Engagement',
    description: 'Add badges, improve description, enable issues/discussions',
    impact: 'Attracts contributors'
  });
  if (!roadmap.length) roadmap.push({
    priority: 'Low',
    title: 'Maintain Excellence',
    description: 'Continue following best practices',
    impact: 'Ensures long-term success'
  });
  return roadmap;
}
