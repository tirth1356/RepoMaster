import {
  getRepositoryData,
  getRepositoryContents,
  getCommitHistory,
  getRepositoryLanguages,
  getReadme,
  getReleases
} from './githubService.js';

export async function analyzeRepositoryLogic(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repository URL');

  const owner = match[1];
  const repo = match[2];

  const [
    repoData,
    contents,
    commits,
    languages,
    readme,
    releases
  ] = await Promise.all([
    getRepositoryData(owner, repo),
    getRepositoryContents(owner, repo),
    getCommitHistory(owner, repo),
    getRepositoryLanguages(owner, repo),
    getReadme(owner, repo),
    getReleases(owner, repo)
  ]);

  const scores = calculateScores(
    repoData,
    contents,
    commits,
    languages,
    readme,
    releases
  );

  return {
    score: scores.overall,
    level: getLevel(scores.overall),
    scores,
    summary: generateSummary(scores, repoData, readme, commits),
    roadmap: generateRoadmap(scores),
    metadata: {
      name: repoData.name,
      url: repoData.html_url,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      primaryLanguage: repoData.language,
      sizeKB: repoData.size,
      openIssues: repoData.open_issues_count
    }
  };
}

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
    scores.documentation * 0.18 +
    scores.structure * 0.14 +
    scores.commits * 0.16 +
    scores.languages * 0.12 +
    scores.community * 0.14 +
    scores.testing * 0.14 +
    scores.versioning * 0.12
  );

  return scores;
}

function calculateDocumentationScore(readme, repoData) {
  let score = 35;

  if (readme) {
    const text = readme.content.toLowerCase();
    const sizeFactor = Math.min(1, readme.size / 1200);
    score += sizeFactor * 30;

    if (text.includes('install') || text.includes('setup')) score += 8;
    if (text.includes('usage') || text.includes('example')) score += 8;
    if (text.includes('api')) score += 5;
    if (text.includes('contribut')) score += 5;
    if (text.includes('license')) score += 4;
    if (text.includes('roadmap') || text.includes('future')) score += 5;
  }

  if (repoData.description && repoData.description.length > 25) score += 6;
  if (repoData.license) score += 4;

  return Math.min(100, score);
}

function calculateStructureScore(contents) {
  let score = 45;
  if (!Array.isArray(contents)) return score;

  const names = contents.map(f => f.name.toLowerCase());

  if (names.includes('src')) score += 10;
  if (names.includes('tests') || names.includes('test')) score += 10;
  if (names.includes('docs')) score += 6;
  if (names.includes('.gitignore')) score += 4;
  if (names.includes('package.json') || names.includes('setup.py') || names.includes('go.mod')) score += 10;
  if (names.includes('.github')) score += 5;
  if (names.includes('eslint.config.js') || names.includes('.prettierrc')) score += 5;

  return Math.min(100, score);
}

function calculateCommitScore(commits) {
  let score = 30;
  if (!Array.isArray(commits) || commits.length === 0) return score;

  if (commits.length >= 100) score += 25;
  else if (commits.length >= 40) score += 20;
  else if (commits.length >= 15) score += 15;
  else score += 8;

  const meaningful = commits.filter(c => {
    const msg = c.commit.message.toLowerCase();
    return msg.length > 12 && !msg.startsWith('wip') && !msg.startsWith('temp');
  }).length;

  score += Math.min(25, (meaningful / commits.length) * 30);

  const recentCutoff = new Date();
  recentCutoff.setMonth(recentCutoff.getMonth() - 3);

  if (commits.some(c => new Date(c.commit.author.date) > recentCutoff)) {
    score += 15;
  }

  return Math.min(100, score);
}

function calculateLanguageScore(languages) {
  let score = 40;
  if (!languages || Object.keys(languages).length === 0) return score;

  const entries = Object.entries(languages);
  const totalBytes = entries.reduce((s, [, b]) => s + b, 0);

  const dominant = entries.filter(([, b]) => b / totalBytes >= 0.08);

  score += 20;

  if (dominant.length >= 2) score += 15;
  if (dominant.length >= 3) score += 5;

  const strongLangs = [
    'javascript','typescript','python','java','go','rust','c++','c#'
  ];

  if (dominant.some(([l]) =>
    strongLangs.some(s => l.toLowerCase().includes(s))
  )) {
    score += 20;
  }

  return Math.min(100, score);
}

function calculateCommunityScore(repoData) {
  let score = 35;

  if (repoData.stargazers_count >= 100) score += 25;
  else if (repoData.stargazers_count >= 10) score += 15;
  else if (repoData.stargazers_count > 0) score += 8;

  if (repoData.forks_count >= 20) score += 15;
  else if (repoData.forks_count > 0) score += 8;

  if (repoData.watchers_count >= 10) score += 6;
  if (repoData.open_issues_count < 15) score += 6;
  if (repoData.description) score += 5;

  return Math.min(100, score);
}

function calculateTestingScore(contents) {
  let score = 35;
  if (!Array.isArray(contents)) return score;

  const names = contents.map(f => f.name.toLowerCase()).join(' ');
  const indicators = [
    'test','spec','coverage','jest','mocha','pytest','vitest','unittest'
  ];

  if (indicators.some(i => names.includes(i))) score += 45;
  if (names.includes('ci') || names.includes('github')) score += 10;

  return Math.min(100, score);
}

function calculateVersioningScore(releases, commits) {
  let score = 40;

  if (Array.isArray(releases) && releases.length > 0) {
    score += 20;
    if (releases.length >= 3) score += 15;
    if (releases.some(r => /^\d+\.\d+\.\d+/.test(r.tag_name))) score += 10;
  }

  return Math.min(100, score);
}

function getLevel(score) {
  if (score >= 75) return 'Advanced';
  if (score >= 55) return 'Intermediate';
  return 'Beginner';
}

function generateSummary(scores, repoData, readme, commits) {
  const level = getLevel(scores.overall).toLowerCase();
  const strengths = [];
  const gaps = [];

  if (scores.documentation >= 70) strengths.push('strong documentation');
  if (scores.testing >= 70) strengths.push('testing practices');
  if (scores.commits >= 70) strengths.push('healthy commit history');
  if (scores.structure >= 70) strengths.push('clear project structure');

  if (scores.documentation < 60) gaps.push('documentation depth');
  if (scores.testing < 60) gaps.push('test coverage');
  if (scores.versioning < 60) gaps.push('release management');

  let text = `This repository represents a ${level} software project primarily written in ${repoData.language || 'multiple languages'}. `;

  if (strengths.length) {
    text += `Notable strengths include ${strengths.join(', ')}. `;
  }

  if (gaps.length) {
    text += `Key areas for improvement are ${gaps.slice(0, 2).join(' and ')}. `;
  }

  text += `With ${repoData.stargazers_count} stars and ${commits.length} commits, the project shows consistent development activity.`;

  return text;
}

function generateRoadmap(scores) {
  const roadmap = [];

  if (scores.documentation < 70) {
    roadmap.push({
      priority: 'High',
      title: 'Strengthen Documentation',
      description: 'Expand README with architecture, examples, and contribution guidelines',
      impact: 'Reduces onboarding time and improves adoption'
    });
  }

  if (scores.testing < 70) {
    roadmap.push({
      priority: 'High',
      title: 'Increase Test Coverage',
      description: 'Add unit and integration tests with coverage reporting',
      impact: 'Improves reliability and prevents regressions'
    });
  }

  if (scores.versioning < 70) {
    roadmap.push({
      priority: 'Medium',
      title: 'Adopt Semantic Versioning',
      description: 'Publish tagged releases with changelogs',
      impact: 'Builds user trust and release clarity'
    });
  }

  if (scores.community < 70) {
    roadmap.push({
      priority: 'Medium',
      title: 'Improve Community Signals',
      description: 'Enhance project description, issues, and contribution signals',
      impact: 'Encourages collaboration and contributions'
    });
  }

  if (!roadmap.length) {
    roadmap.push({
      priority: 'Low',
      title: 'Maintain Quality',
      description: 'Continue following current development practices',
      impact: 'Ensures long-term stability'
    });
  }

  return roadmap;
}
