export default function ScoreDisplay({ score, level }) {
  const getScoreStyles = () => {
    if (score >= 75)
      return {
        text: 'from-emerald-400 to-green-500',
        bar: 'score-advanced',
        badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        message: 'Excellent work! Your repository demonstrates advanced engineering practices.',
      };

    if (score >= 50)
      return {
        text: 'from-purple-400 to-fuchsia-500',
        bar: 'score-intermediate',
        badge: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30',
        message: 'Good foundation! Focus on improvements to reach an advanced level.',
      };

    return {
      text: 'from-yellow-400 to-orange-500',
      bar: 'score-beginner',
      badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
      message: 'Early stage. Follow the roadmap below to strengthen your project.',
    };
  };

  const styles = getScoreStyles();

  return (
    <div className="fade-in card">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
          Repository Score
        </h2>

        <div
          className={`text-7xl font-extrabold mb-4 bg-gradient-to-r ${styles.text} bg-clip-text text-transparent`}
        >
          {score}/100
        </div>

        <span
          className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${styles.badge}`}
        >
          {level}
        </span>
      </div>

      <div>
        <div className="progress-bar mb-3">
          <div
            className={`progress-fill ${styles.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 text-center">
          {styles.message}
        </p>
      </div>
    </div>
  );
}
