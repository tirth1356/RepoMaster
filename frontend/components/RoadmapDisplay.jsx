export default function RoadmapDisplay({ roadmap }) {
  const getPriorityStyles = (priority) => {
    if (priority === 'High')
      return {
        card:
          'border-l-4 border-red-500/90 ' +
          'bg-gradient-to-br from-red-950/30 to-slate-900/80 ' +
          'hover:shadow-red-500/30',
        badge:
          'bg-red-500/20 text-red-400 border border-red-500/40',
      };

    if (priority === 'Medium')
      return {
        card:
          'border-l-4 border-purple-500/90 ' +
          'bg-gradient-to-br from-purple-950/40 to-slate-900/80 ' +
          'hover:shadow-purple-500/30',
        badge:
          'bg-purple-500/20 text-purple-400 border border-purple-500/40',
      };

    return {
      card:
        'border-l-4 border-emerald-500/90 ' +
        'bg-gradient-to-br from-emerald-950/30 to-slate-900/80 ' +
        'hover:shadow-emerald-500/30',
      badge:
        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    };
  };

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
        Improvement Roadmap
      </h2>

      <div className="space-y-6">
        {roadmap.map((item, index) => {
          const styles = getPriorityStyles(item.priority);

          return (
            <div
              key={index}
              className={`slide-up card ${styles.card}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-100">
                  {item.title}
                </h3>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}
                >
                  {item.priority}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold mb-1 text-gray-200">
                  💡 Impact
                </p>
                <p className="text-sm text-gray-400">
                  {item.impact}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruiter Note */}
      <div className="mt-10 card border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-slate-900/80">
        <h3 className="font-semibold text-lg text-purple-300 mb-2">
          💼 For Recruiters & Mentors
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm">
          Completing this roadmap shows prioritization skills, ownership,
          and a strong engineering mindset — traits recruiters and mentors
          actively seek.
        </p>
      </div>
    </div>
  );
}
