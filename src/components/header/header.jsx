import "./header.css";

export default function Header({ onLogMoodClick, onStatsClick }) {
  return (
    <header className="app-header">
      <h1>HoliMood</h1>
      <nav>
        <button className="log-mood-btn" onClick={onLogMoodClick}>
          + Log Mood
        </button>
        <button className="log-mood-btn" onClick={onStatsClick}>
          View Stats
        </button>
      </nav>
    </header>
  );
}
