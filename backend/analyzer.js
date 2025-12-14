const githubService = require('./githubService');

/**
 * Analyze a GitHub repository and return evaluation
 */
async function analyzeRepository(owner, repo) {
  try {
    // Fetch all required data
    const [repoData, contents, commits, languages, readme, releases] = await Promise.all([
      githubService.getRepositoryData(owner, repo),
      githubService.getRepositoryContents(owner, repo),
      githubService.getCommitHistory(owner, repo),
      githubService.getRepositoryLanguages(owner, repo),
      githubService.getReadme(owner, repo),
      githubService.getReleases(owner, repo)
    ]);

    // Calculate evaluation scores
    const scores = calculateScores(repoData, contents, commits, languages, readme, releases);
    
    // Generate summary and roadmap
    const summary = generateSummary(scores, repoData, readme);
    const roadmap = generateRoadmap(scores);

    return {
      score: scores.overall,
      level: getLevel(scores.overall),
      scores,
      summary,
      roadmap,
      metadata: {
        name: repoData.name,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Calculate evaluation scores for different aspects
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

  // Calculate weighted overall score
  scores.overall = Math.round(
    scores.documentation * 0.20 +
    scores.structure * 0.15 +
    scores.commits * 0.15 +
    scores.languages * 0.10 +
    scores.community * 0.15 +
    scores.testing * 0.15 +
    scores.versioning * 0.10
  );

  return scores;
}

/**
 * Score based on README quality and completeness
 */
function calculateDocumentationScore(readme, repoData) {
  let score = 0;

  if (readme) {
    const content = readme.content.toLowerCase();
    const size = readme.size;

    // Size check - good READMEs are typically 500+ characters
    score += Math.min(50, (size / 500) * 50);

    // Content checks
    if (content.includes('install') || content.includes('setup')) score += 10;
    if (content.includes('usage') || content.includes('example')) score += 10;
    if (content.includes('license')) score += 5;
    if (content.includes('contribut')) score += 5;
  }

  // License bonus
  if (repoData.license) score += 10;

  return Math.min(100, score);
}

/**
 * Score based on project structure and organization
 */
function calculateStructureScore(contents) {
  let score = 50; // Base score

  if (!Array.isArray(contents)) return score;

  const fileNames = contents.map(f => f.name.toLowerCase());

  // Directory structure checks
  if (fileNames.some(n => n === 'src')) score += 10;
  if (fileNames.some(n => n === 'tests' || n === 'test')) score += 10;
  if (fileNames.some(n => n === 'docs' || n === 'documentation')) score += 5;
  if (fileNames.some(n => n === '.gitignore')) score += 5;
  if (fileNames.some(n => n === 'package.json' || n === 'setup.py' || n === 'go.mod')) score += 10;

  return Math.min(100, score);
}

/**
 * Score based on commit history consistency
 */
function calculateCommitScore(commits) {
  if (!Array.isArray(commits) || commits.length === 0) return 20;

  let score = 0;

  // Commit count
  if (commits.length >= 50) score += 20;
  else if (commits.length >= 20) score += 15;
  else if (commits.length >= 10) score += 10;
  else score += 5;

  // Message quality analysis
  const meaningfulCommits = commits.filter(c => {
    const msg = c.commit.message.toLowerCase();
    const length = c.commit.message.length;
    return length > 10 && !msg.startsWith('wip') && !msg.startsWith('temp');
  }).length;

  const meaningfulRatio = meaningfulCommits / commits.length;
  score += meaningfulRatio * 60;

  // Recent activity (if commits in last 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentCommits = commits.filter(c => new Date(c.commit.author.date) > threeMonthsAgo);
  
  if (recentCommits.length > 0) score += 20;

  return Math.min(100, score);
}

/**
 * Score based on language diversity
 */
function calculateLanguageScore(languages) {
  if (!languages || Object.keys(languages).length === 0) return 30;

  const languageCount = Object.keys(languages).length;
  let score = 0;

  // Prefer some language diversity
  if (languageCount >= 2) score += 30;
  if (languageCount >= 3) score += 20;

  // Known good languages (bonus)
  const goodLanguages = ['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'c++'];
  const hasGoodLanguage = Object.keys(languages).some(lang =>
    goodLanguages.some(g => lang.toLowerCase().includes(g))
  );

  if (hasGoodLanguage) score += 40;

  return Math.min(100, score);
}

/**
 * Score based on community engagement
 */
function calculateCommunityScore(repoData) {
  let score = 0;

  // Stars and forks as community interest
  if (repoData.stargazers_count >= 100) score += 30;
  else if (repoData.stargazers_count >= 10) score += 20;
  else if (repoData.stargazers_count > 0) score += 10;

  if (repoData.forks_count >= 10) score += 20;
  else if (repoData.forks_count > 0) score += 10;

  // Watchers and issues
  if (repoData.watchers_count >= 10) score += 15;
  if (repoData.open_issues_count < 20) score += 10;

  // Description presence
  if (repoData.description && repoData.description.length > 20) score += 15;

  return Math.min(100, score);
}

/**
 * Score based on test presence
 */
function calculateTestingScore(contents) {
  let score = 30; // Base score for at least having tests

  if (!Array.isArray(contents)) return score;

  const allFiles = contents.map(f => f.name.toLowerCase()).join(' ');

  const testIndicators = [
    'test',
    'spec',
    'coverage',
    'jest',
    'mocha',
    'pytest',
    'unittest',
    'gotest'
  ];

  const hasTestFiles = testIndicators.some(indicator => allFiles.includes(indicator));

  if (hasTestFiles) score += 70;

  return Math.min(100, score);
}

/**
 * Score based on versioning and releases
 */
function calculateVersioningScore(releases, commits) {
  let score = 30;

  if (Array.isArray(releases) && releases.length > 0) {
    if (releases.length >= 5) score += 40;
    else if (releases.length >= 2) score += 30;
    else score += 20;

    // Check for semantic versioning
    const semanticVersions = releases.filter(r => /^\d+\.\d+\.\d+/.test(r.tag_name));
    if (semanticVersions.length > 0) score += 10;
  }

  return Math.min(100, score);
}

/**
 * Convert score to skill level
 */
function getLevel(score) {
  if (score >= 75) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  return 'Beginner';
}

/**
 * Generate a written summary of the repository
 */
function generateSummary(scores, repoData, readme) {
  const level = getLevel(scores.overall);
  const strengths = [];
  const improvements = [];

  // Identify strengths
  if (scores.documentation >= 70) strengths.push('comprehensive documentation');
  if (scores.commits >= 70) strengths.push('consistent commit history');
  if (scores.community >= 70) strengths.push('good community engagement');
  if (scores.testing >= 70) strengths.push('solid test coverage');

  // Identify areas for improvement
  if (scores.documentation < 50) improvements.push('improve README with setup and usage instructions');
  if (scores.testing < 50) improvements.push('add unit and integration tests');
  if (scores.commits < 50) improvements.push('establish more consistent commit practices');
  if (scores.structure < 50) improvements.push('better organize project structure');
  if (scores.versioning < 50) improvements.push('create releases and version tags');

  let summary = `This ${repoData.language || 'general'} repository demonstrates a ${level.toLowerCase()}-level project. `;

  if (strengths.length > 0) {
    summary += `Strengths include: ${strengths.join(', ')}. `;
  }

  if (improvements.length > 0) {
    summary += `To improve, focus on: ${improvements.slice(0, 2).join(' and ')}. `;
  } else {
    summary += `This is a well-maintained project with good practices applied. `;
  }

  summary += `The repository has ${repoData.stargazers_count} stars and reflects ${repoData.language || 'mixed'} language usage.`;

  return summary;
}

/**
 * Generate actionable roadmap for improvement
 */
function generateRoadmap(scores) {
  const roadmap = [];

  if (scores.documentation < 70) {
    roadmap.push({
      priority: 'High',
      title: 'Improve Documentation',
      description: 'Create or enhance README with clear setup instructions, usage examples, and contribution guidelines',
      impact: 'Helps users understand and use your project'
    });
  }

  if (scores.testing < 70) {
    roadmap.push({
      priority: 'High',
      title: 'Add Test Coverage',
      description: 'Write unit and integration tests. Aim for at least 60-70% code coverage using Jest, Pytest, or similar tools',
      impact: 'Ensures code quality and prevents regressions'
    });
  }

  if (scores.commits < 70) {
    roadmap.push({
      priority: 'Medium',
      title: 'Improve Commit Practices',
      description: 'Write meaningful commit messages that describe what changed and why. Use conventional commits format (feat:, fix:, etc.)',
      impact: 'Makes project history cleaner and more useful'
    });
  }

  if (scores.structure < 70) {
    roadmap.push({
      priority: 'Medium',
      title: 'Organize Project Structure',
      description: 'Create clear directories like /src, /tests, /docs. Separate concerns and follow language-specific conventions',
      impact: 'Improves code maintainability and readability'
    });
  }

  if (scores.versioning < 70) {
    roadmap.push({
      priority: 'Medium',
      title: 'Implement Versioning',
      description: 'Create releases on GitHub and use semantic versioning (v1.0.0). Add changelog documenting major changes',
      impact: 'Helps users track changes and understand breaking changes'
    });
  }

  if (scores.community < 70) {
    roadmap.push({
      priority: 'Low',
      title: 'Increase Community Engagement',
      description: 'Add badges, improve project description, enable issues/discussions, and create contribution guidelines',
      impact: 'Attracts users and contributors to your project'
    });
  }

  if (roadmap.length === 0) {
    roadmap.push({
      priority: 'Low',
      title: 'Maintain Excellence',
      description: 'Continue following best practices and keep the project updated and responsive to community feedback',
      impact: 'Ensures long-term project success and user satisfaction'
    });
  }

  return roadmap;
}

module.exports = {
  analyzeRepository
};
