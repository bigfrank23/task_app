const ProgressRing = ({ progress }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <svg className="progress-ring" width="48" height="48">
      <circle
        className="progress-ring-bg"
        cx="24"
        cy="24"
        r={radius}
      />
      <circle
        className="progress-ring-progress"
        cx="24"
        cy="24"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

export default ProgressRing;
