import { useState, useRef } from 'react';
import Link from 'next/link';
import { analyzeRepository } from '../lib/api';
import ScoreDisplay from '../components/ScoreDisplay';
import SummaryDisplay from '../components/SummaryDisplay';
import RoadmapDisplay from '../components/RoadmapDisplay';

export default function Analyze() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const resultsRef = useRef(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);

    try {
      const response = await analyzeRepository(url);
      if (response.success) {
        setResults(response.data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError('Failed to analyze repository. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setUrl('');
    setError(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen text-gray-200">
      {/* NAVBAR */}
      <nav className="border-b border-purple-500/10 backdrop-blur-xl">
        <div className="container py-4">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent"
          >
            REPO MASTER
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="container py-20">
        {!results ? (
          <div className="max-w-2xl mx-auto">
            {/* INPUT CARD */}
            <div className="card mb-12 hover:shadow-purple-500/30">
              <h1 className="text-4xl font-bold text-white mb-3">
                Analyze Repository
              </h1>
              <p className="text-gray-400 mb-8">
                Paste a public GitHub repository URL to get a detailed evaluation.
              </p>

              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="input-field"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Example: https://github.com/torvalds/linux
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn-primary text-lg py-4 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Repository'
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 font-semibold mb-1">Error</p>
                  <p className="text-red-300">{error}</p>
                </div>
              )}
            </div>

            {/* INFO CARDS */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ['✅ Public Repositories Only', 'Private repositories cannot be analyzed.'],
                  ['⚡ Fast Analysis', 'Most repositories finish in under 30 seconds.'],
                  ['🔒 Privacy First', 'No login, no storage, no tracking.'],
                  ['📊 Honest Feedback', 'Rule-based analysis to help you improve.'],
                ].map(([title, desc], i) => (
                  <div
                    key={i}
                    className="card hover:-translate-y-1 hover:shadow-purple-500/20 transition-all"
                  >
                    <h3 className="font-semibold mb-2 text-gray-100">{title}</h3>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* RESULTS */
          <div ref={resultsRef} className="max-w-4xl mx-auto">
            <button
              onClick={handleNewAnalysis}
              className="mb-10 text-purple-400 hover:text-red-400 font-semibold transition-colors"
            >
              ← Analyze another repository
            </button>

            <div className="space-y-12">
              <ScoreDisplay score={results.score} level={results.level} />
              <SummaryDisplay summary={results.summary} metadata={results.metadata} />
              <RoadmapDisplay roadmap={results.roadmap} />

              {/* DETAILED SCORES */}
              <div className="card hover:shadow-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Detailed Scores
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(results.scores)
                    .filter(([key]) => key !== 'overall')
                    .map(([key, score]) => (
                      <div
                        key={key}
                        className="bg-white/5 border border-purple-500/20 p-4 rounded-xl
                                   hover:-translate-y-1 hover:shadow-purple-500/20 transition-all"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-300 capitalize">
                            {key}
                          </span>
                          <span className="font-bold text-purple-400">
                            {score}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill score-intermediate"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <div className="card text-center hover:shadow-red-500/30">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Improve & Re-Analyze
                </h3>
                <p className="text-gray-400 mb-6">
                  Apply the roadmap suggestions and re-run analysis to track
                  your progress.
                </p>
                <button onClick={handleNewAnalysis} className="btn-primary">
                  Analyze Another Repository
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-purple-500/10 py-8 text-center text-sm text-gray-400">
        © 2025 REPO MASTER · Built for developers
      </footer>
    </div>
  );
}
