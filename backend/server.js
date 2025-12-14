const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { analyzeRepository } = require('./analyzer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GitHub Repository Evaluator API is running' });
});

/**
 * POST /api/analyze
 * Analyze a GitHub repository
 * Body: { url: 'https://github.com/owner/repo' }
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'Missing repository URL',
        message: 'Please provide a GitHub repository URL'
      });
    }

    // Parse GitHub URL
    const match = url.match(/github\.com[:/]([^/]+)\/([^/\.]+)/i);
    if (!match) {
      return res.status(400).json({
        error: 'Invalid GitHub URL',
        message: 'Please provide a valid GitHub repository URL (e.g., https://github.com/owner/repo)'
      });
    }

    const owner = match[1];
    const repo = match[2];

    console.log(`Analyzing repository: ${owner}/${repo}`);

    // Analyze the repository
    const evaluation = await analyzeRepository(owner, repo);

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Analysis error:', error.message);

    // Check for specific error types
    if (error.message.includes('404')) {
      return res.status(404).json({
        error: 'Repository not found',
        message: 'The specified repository does not exist or is private'
      });
    }

    if (error.message.includes('403')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This repository is private or access is restricted'
      });
    }

    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An error occurred while analyzing the repository'
    });
  }
});

/**
 * GET /api/analyze/:owner/:repo
 * Alternative endpoint to analyze a repository without body
 */
app.get('/api/analyze/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Please provide both owner and repo parameters'
      });
    }

    console.log(`Analyzing repository: ${owner}/${repo}`);

    // Analyze the repository
    const evaluation = await analyzeRepository(owner, repo);

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Analysis error:', error.message);

    if (error.message.includes('404')) {
      return res.status(404).json({
        error: 'Repository not found',
        message: 'The specified repository does not exist or is private'
      });
    }

    if (error.message.includes('403')) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This repository is private or access is restricted'
      });
    }

    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An error occurred while analyzing the repository'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Server error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`GitHub Repository Evaluator API listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`POST /api/analyze with { "url": "https://github.com/owner/repo" }`);
});
