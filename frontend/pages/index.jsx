import Link from 'next/link';
import { useState, useEffect } from 'react';
import { healthCheck } from '../lib/api';

export default function Home() {
  const [backendHealthy, setBackendHealthy] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      const result = await healthCheck();
      setBackendHealthy(result !== null);
    };
    checkHealth();
  }, []);

  const cardHover =
    'transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      <nav className="border-b border-slate-800">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            REPO MASTER
          </div>

          {backendHealthy !== null && (
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  backendHealthy ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-gray-400">
                {backendHealthy ? 'Service Active' : 'Service Offline'}
              </span>
            </div>
          )}
        </div>
      </nav>

      <section className="container py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Evaluate Your GitHub Repository
          </h1>
          <p className="text-xl text-gray-400 mb-10">
            Honest, actionable feedback to help your projects stand out to recruiters and mentors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/analyze" className="btn-primary text-lg">
              Analyze Repository
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-secondary text-lg"
            >
              Learn More
            </button>
          </div>

          {!backendHealthy && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold">
                Backend service is offline. Start server on port 5000.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="py-20 border-t border-slate-800">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              ['1', 'Paste Repository URL'],
              ['2', 'Automated Analysis'],
              ['3', 'Get Feedback'],
            ].map(([num, title]) => (
              <div key={num} className={`card text-center ${cardHover}`}>
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">
                  {num === '1' && 'Enter any public GitHub repository URL.'}
                  {num === '2' && 'We analyze structure, commits, tests, and docs.'}
                  {num === '3' && 'You get score, summary, and roadmap.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">
            What We Evaluate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              ['📚 Documentation', 'README quality and setup clarity'],
              ['🏗️ Structure', 'Clean project organization'],
              ['✍️ Commits', 'Meaningful commit history'],
              ['🧪 Testing', 'Unit & integration tests'],
              ['🌐 Languages', 'Tech stack decisions'],
              ['🚀 Releases', 'Versioning & releases'],
            ].map(([title, desc]) => (
              <div key={title} className={`card ${cardHover}`}>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-10 text-center text-gray-400 text-sm">
        © 2025 REPO MASTER · No login · No database · Pure analysis
      </footer>
    </div>
  );
}
