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

function calculateScores(repoData, contents, commits, languages, readme, releases) {
  const scores = {
    documentation: documentationScore(readme, repoData),
    structure: structureScore(contents),
    commits: commitScore(commits),
    languages: languageScore(languages),
    testing: testingScore(contents),
    versioning: versioningScore(releases),
    community: communityScore(repoData),
    overall: 0
  };

  scores.overall = Math.round(
    scores.documentation * 0.22 +
    scores.structure     * 0.15 +
    scores.commits       * 0.15 +
    scores.languages     * 0.13 +
    scores.testing       * 0.15 +
    scores.versioning    * 0.10 +
    scores.community     * 0.10
  );

  return scores;
}

function documentationScore(readme, repoData) {
  let s = 35;

  if (readme?.content) {
    const t = readme.content.toLowerCase();
    s += Math.min(30, readme.size / 350);
    if (t.includes('install') || t.includes('setup')) s += 10;
    if (t.includes('usage') || t.includes('example')) s += 10;
    if (t.includes('license')) s += 5;
    if (t.includes('contribut')) s += 5;
  }

  if (repoData.description) s += 10;
  if (repoData.license) s += 10;

  return Math.min(100, s);
}

function structureScore(contents) {
  let s = 45;
  if (!Array.isArray(contents)) return s;

  const n = contents.map(f => f.name.toLowerCase());

  if (n.includes('src')) s += 10;
  if (n.includes('tests') || n.includes('test')) s += 10;
  if (n.includes('docs')) s += 5;
  if (n.includes('.gitignore')) s += 5;
  if (n.some(x => ['package.json','setup.py','go.mod','pom.xml'].includes(x))) s += 10;

  return Math.min(100, s);
}

function commitScore(commits) {
  if (!Array.isArray(commits) || commits.length === 0) return 35;

  let s = 35;

  if (commits.length >= 40) s += 20;
  else if (commits.length >= 20) s += 15;
  else if (commits.length >= 10) s += 10;

  const meaningful = commits.filter(c => {
    const m = c.commit.message.toLowerCase();
    return m.length > 12 && !m.startsWith('wip') && !m.startsWith('temp');
  }).length;

  s += Math.min(25, (meaningful / commits.length) * 25);

  const recent = commits.some(c => {
    const d = new Date(c.commit.author.date);
    const m = new Date();
    m.setMonth(m.getMonth() - 3);
    return d > m;
  });

  if (recent) s += 15;

  return Math.min(100, s);
}

function languageScore(languages) {
  if (!languages || Object.keys(languages).length === 0) return 40;

  const e = Object.entries(languages);
  const total = e.reduce((a, [,b]) => a + b, 0);
  const dominant = e.filter(([,b]) => b / total >= 0.15);

  let s = 40;

  if (dominant.length >= 1) s += 20;
  if (dominant.length >= 2) s += 15;
  if (dominant.length >= 3) s += 5;

  const good = ['javascript','typescript','python','java','go','rust','c++','c','c#'];

  if (dominant.some(([l]) => good.some(g => l.toLowerCase().includes(g)))) s += 20;

  return Math.min(100, s);
}

function testingScore(contents) {
  let s = 40;
  if (!Array.isArray(contents)) return s;

  const t = contents.map(f => f.name.toLowerCase()).join(' ');
  const i = ['test','spec','jest','mocha','pytest','vitest','coverage'];

  if (i.some(x => t.includes(x))) s += 45;

  return Math.min(100, s);
}

function versioningScore(releases) {
  let s = 45;

  if (Array.isArray(releases) && releases.length > 0) {
    s += 30;
    if (releases.some(r => /^\d+\.\d+\.\d+/.test(r.tag_name))) s += 15;
  }

  return Math.min(100, s);
}

function communityScore(repoData) {
  let s = 40;

  if (repoData.stargazers_count > 0) s += 10;
  if (repoData.stargazers_count >= 10) s += 10;
  if (repoData.forks_count > 0) s += 10;
  if (repoData.watchers_count > 0) s += 10;
  if (repoData.description?.length > 20) s += 10;

  return Math.min(100, s);
}

function getLevel(score) {
  if (score >= 75) return 'Advanced';
  if (score >= 55) return 'Intermediate';
  return 'Beginner';
}

function generateSummary(scores, repoData, readme) {
  const strengths = [];
  const gaps = [];

  if (scores.documentation >= 70) strengths.push('clear documentation');
  else gaps.push('improve README and usage instructions');

  if (scores.testing >= 70) strengths.push('testing practices');
  else gaps.push('add automated tests');

  if (scores.commits >= 70) strengths.push('consistent commit history');
  else gaps.push('maintain cleaner commit practices');

  if (scores.structure >= 70) strengths.push('well-organized structure');
  else gaps.push('organize project structure');

  let text = `This ${repoData.language || 'multi-language'} repository represents a ${getLevel(scores.overall).toLowerCase()}-level project. `;

  if (strengths.length)
    text += `Key strengths include ${strengths.join(', ')}. `;

  if (gaps.length)
    text += `To improve further, focus on ${gaps.slice(0,2).join(' and ')}. `;

  text += `The project has ${repoData.stargazers_count} stars and reflects active development patterns.`;

  return text;
}

function generateRoadmap(scores) {
  const r = [];

  if (scores.documentation < 70)
    r.push({
      priority: 'High',
      title: 'Improve Documentation',
      description: 'Add setup, usage, and contribution guidelines',
      impact: 'Improves usability and onboarding'
    });

  if (scores.testing < 70)
    r.push({
      priority: 'High',
      title: 'Add Test Coverage',
      description: 'Write unit and integration tests',
      impact: 'Increases reliability and confidence'
    });

  if (scores.commits < 70)
    r.push({
      priority: 'Medium',
      title: 'Improve Commit Practices',
      description: 'Use meaningful commit messages',
      impact: 'Creates a cleaner project history'
    });

  if (scores.structure < 70)
    r.push({
      priority: 'Medium',
      title: 'Organize Project Structure',
      description: 'Introduce src, tests, and docs folders',
      impact: 'Improves maintainability'
    });

  if (scores.versioning < 70)
    r.push({
      priority: 'Medium',
      title: 'Add Releases & Versioning',
      description: 'Create tagged releases using semantic versioning',
      impact: 'Helps users track changes'
    });

  if (!r.length)
    r.push({
      priority: 'Low',
      title: 'Maintain Quality',
      description: 'Continue following current best practices',
      impact: 'Ensures long-term project health'
    });

  return r;
}
