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
    summary: generateSummary(scores, repoData),
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
    community: communityScore(repoData),
    testing: testingScore(contents),
    versioning: versioningScore(releases),
    overall: 0
  };

  scores.overall = Math.round(
    scores.documentation * 0.20 +
    scores.structure     * 0.15 +
    scores.commits       * 0.15 +
    scores.languages     * 0.15 +
    scores.testing       * 0.15 +
    scores.community     * 0.10 +
    scores.versioning    * 0.10
  );

  return scores;
}

function documentationScore(readme, repoData) {
  let s = 45;

  if (readme?.content) {
    const t = readme.content.toLowerCase();
    s += Math.min(25, readme.size / 400);
    if (t.includes('install') || t.includes('setup')) s += 10;
    if (t.includes('usage') || t.includes('example')) s += 10;
    if (t.includes('api')) s += 5;
  }

  if (repoData.description) s += 10;
  if (repoData.license) s += 10;

  return Math.min(100, s);
}

function structureScore(contents) {
  let s = 50;
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
  if (!Array.isArray(commits) || commits.length === 0) return 45;

  let s = 40;

  if (commits.length >= 50) s += 20;
  else if (commits.length >= 20) s += 15;
  else if (commits.length >= 10) s += 10;

  const meaningful = commits.filter(c => {
    const m = c.commit.message.toLowerCase();
    return m.length > 12 && !m.startsWith('wip');
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
  if (!languages || Object.keys(languages).length === 0) return 55;

  const e = Object.entries(languages);
  const total = e.reduce((a, [,b]) => a + b, 0);
  const dominant = e.filter(([,b]) => b / total >= 0.1);

  let s = 45;

  if (dominant.length >= 1) s += 20;
  if (dominant.length >= 2) s += 15;
  if (dominant.length >= 3) s += 5;

  const good = ['javascript','typescript','python','java','go','rust','c++','c','c#'];

  if (dominant.some(([l]) => good.some(g => l.toLowerCase().includes(g)))) s += 15;

  return Math.min(100, s);
}

function communityScore(repoData) {
  let s = 45;

  if (repoData.stargazers_count > 0) s += 10;
  if (repoData.stargazers_count >= 10) s += 10;
  if (repoData.forks_count > 0) s += 10;
  if (repoData.watchers_count > 0) s += 10;
  if (repoData.description?.length > 20) s += 10;

  return Math.min(100, s);
}

function testingScore(contents) {
  let s = 55;
  if (!Array.isArray(contents)) return s;

  const t = contents.map(f => f.name.toLowerCase()).join(' ');
  const i = ['test','spec','jest','mocha','pytest','vitest','coverage'];

  if (i.some(x => t.includes(x))) s += 35;

  return Math.min(100, s);
}

function versioningScore(releases) {
  let s = 55;

  if (Array.isArray(releases) && releases.length > 0) {
    s += 25;
    if (releases.some(r => /^\d+\.\d+\.\d+/.test(r.tag_name))) s += 20;
  }

  return Math.min(100, s);
}

function getLevel(score) {
  if (score >= 75) return 'Advanced';
  if (score >= 55) return 'Intermediate';
  return 'Beginner';
}

function generateSummary(scores, repoData) {
  let text = `This ${repoData.language || 'multi-language'} repository reflects a ${getLevel(scores.overall).toLowerCase()} level of engineering quality. `;

  if (scores.documentation >= 70) text += 'Documentation is well written. ';
  if (scores.testing >= 70) text += 'Testing practices are present. ';
  if (scores.commits >= 70) text += 'Commit history is consistent. ';

  text += `The project currently has ${repoData.stargazers_count} stars.`;

  return text;
}

function generateRoadmap(scores) {
  const r = [];

  if (scores.documentation < 70) r.push({ priority: 'High', title: 'Improve Documentation' });
  if (scores.testing < 70) r.push({ priority: 'High', title: 'Add Test Coverage' });
  if (scores.structure < 70) r.push({ priority: 'Medium', title: 'Improve Project Structure' });
  if (scores.versioning < 70) r.push({ priority: 'Medium', title: 'Add Releases & Versioning' });

  if (!r.length) r.push({ priority: 'Low', title: 'Maintain Current Quality' });

  return r;
}
