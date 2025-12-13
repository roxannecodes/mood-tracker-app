import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Stats.css";

export default function Stats({ entries, onClose }) {
  const moodByWeekdayRef = useRef(null);
  const moodDistributionRef = useRef(null);
  const activitiesByMoodRef = useRef(null);
  const chartsRef = useRef({});

  useEffect(() => {
    // Cleanup function to destroy charts
    return () => {
      Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
    };
  }, []);

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Destroy existing charts
    Object.values(chartsRef.current).forEach((chart) => chart?.destroy());
    chartsRef.current = {};

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Chart 1: Average Mood by Weekday
    if (moodByWeekdayRef.current) {
      const avgMoodData = weekdays.map((wd) => {
        const wdEntries = entries.filter((e) => e.weekday === wd);
        if (wdEntries.length === 0) return 0;
        return (
          wdEntries.reduce((sum, e) => sum + e.mood_rating, 0) /
          wdEntries.length
        );
      });

      chartsRef.current.moodByWeekday = new Chart(moodByWeekdayRef.current, {
        type: "bar",
        data: {
          labels: weekdays,
          datasets: [
            {
              label: "Average Mood (1-5)",
              data: avgMoodData,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Average Mood by Weekday",
              font: { size: 18 },
            },
          },
        },
      });
    }

    // Chart 2: Mood Distribution (Pie Chart)
    if (moodDistributionRef.current) {
      const moodCounts = entries.reduce((acc, e) => {
        const mood = e.mood_category;
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(moodCounts);
      const values = Object.values(moodCounts);
      const colors = {
        excited: "#FFD97B",
        happy: "#CBFF8D",
        neutral: "#EA8CFF",
        sad: "#8CD7FF",
        angry: "#FF8C8C",
        calm: "#8CD7FF",
      };

      chartsRef.current.moodDistribution = new Chart(
        moodDistributionRef.current,
        {
          type: "pie",
          data: {
            labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [
              {
                data: values,
                backgroundColor: labels.map((l) => colors[l] || "#999"),
                borderWidth: 2,
                borderColor: "#fff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Mood Distribution",
                font: { size: 18 },
              },
              legend: {
                position: "bottom",
              },
            },
          },
        }
      );
    }

    // Chart 3: Top Activities
    if (activitiesByMoodRef.current) {
      const activityCounts = entries.reduce((acc, e) => {
        if (e.activities && e.activities.length > 0) {
          e.activities.forEach((activity) => {
            acc[activity] = (acc[activity] || 0) + 1;
          });
        }
        return acc;
      }, {});

      const topActivities = Object.entries(activityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      chartsRef.current.activitiesByMood = new Chart(
        activitiesByMoodRef.current,
        {
          type: "bar",
          data: {
            labels: topActivities.map(([activity]) => activity),
            datasets: [
              {
                label: "Count",
                data: topActivities.map(([, count]) => count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
              title: {
                display: true,
                text: "Top 10 Activities",
                font: { size: 18 },
              },
            },
          },
        }
      );
    }
  }, [entries]);

  return (
    <div className="stats">
      <div className="stats__overlay" onClick={onClose}></div>
      <div className="stats__container">
        <div className="stats__header">
          <h1 className="stats__title">📊 Mood Statistics</h1>
          <button className="stats__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="stats__content">
          <div className="stats__summary">
            <div className="stats__summary-card">
              <h3>Total Entries</h3>
              <p className="stats__summary-value">{entries.length}</p>
            </div>
            <div className="stats__summary-card">
              <h3>Average Mood</h3>
              <p className="stats__summary-value">
                {entries.length > 0
                  ? (
                      entries.reduce((sum, e) => sum + e.mood_rating, 0) /
                      entries.length
                    ).toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <div className="stats__summary-card">
              <h3>Most Common Mood</h3>
              <p className="stats__summary-value">
                {entries.length > 0
                  ? Object.entries(
                      entries.reduce((acc, e) => {
                        acc[e.mood_category] = (acc[e.mood_category] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([, a], [, b]) => b - a)[0][0]
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="stats__chart-container">
            <canvas ref={moodByWeekdayRef}></canvas>
          </div>

          <div className="stats__chart-container">
            <canvas ref={moodDistributionRef}></canvas>
          </div>

          <div className="stats__chart-container">
            <canvas ref={activitiesByMoodRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
