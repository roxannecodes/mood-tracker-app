import { useState } from "react";
import MoodForm from "../MoodLogger/MoodForm";
import MoodDashboard from "../Dashboard/MoodDashboard";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'stats'

  // TODO: Implement data loading and state management
  // - Load entries from localStorage
  // - Load sample data on first run
  // - Calculate statistics

  const handleMoodSubmit = (formData) => {
    // TODO: Save mood entry to localStorage
    console.log("Mood submitted:", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <Header
        onLogMoodClick={() => setIsModalOpen(true)}
        onStatsClick={() => setView(view === "stats" ? "dashboard" : "stats")}
        currentView={view}
      />

      <main className="app-main">
        {view === "dashboard" ? (
          <div className="dashboard">
            <h2>Your Mood Dashboard</h2>
            <p>Dashboard content coming soon...</p>
          </div>
        ) : (
          <MoodDashboard entries={[]} stats={null} />
        )}
      </main>

      <Footer />

      {isModalOpen && (
        <MoodForm
          onSubmit={handleMoodSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
