export default function SummaryDisplay({ summary, metadata }) {
  return (
    <div className="fade-in card">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
        Analysis Summary
      </h2>

      {/* Summary Highlight */}
      <div className="bg-gradient-to-r from-purple-500/10 to-red-500/10
                      border-l-4 border-purple-500/70
                      p-5 rounded-xl mb-8">
        <p className="text-gray-300 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-semibold mb-1">
            Repository Name
          </p>
          <p className="text-lg text-gray-100 font-medium">
            {metadata.name}
          </p>
        </div>

        {metadata.language && (
          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400 font-semibold mb-1">
              Primary Language
            </p>
            <p className="text-lg text-gray-100 font-medium">
              {metadata.language}
            </p>
          </div>
        )}

        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-semibold mb-1">
            Stars
          </p>
          <p className="text-lg text-gray-100 font-medium">
            ⭐ {metadata.stars}
          </p>
        </div>

        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-sm text-gray-400 font-semibold mb-1">
            Forks
          </p>
          <p className="text-lg text-gray-100 font-medium">
            🔀 {metadata.forks}
          </p>
        </div>
      </div>

      {/* GitHub Link */}
      <a
        href={metadata.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-8
                   text-purple-400 font-semibold
                   hover:text-red-400 transition-colors"
      >
        View on GitHub
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
