import React from "react";
import { useState, useEffect } from "react";
import * as api from "../api";
export default function StudentDashboard({
  user
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user && user.student && user.student.id) {
      api.getStudentAttendanceStats(user.student.id).then(setStats).catch(err => setError(err.message)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);
  if (loading) {
    return <div>Loading attendance stats...</div>;
  }
  if (error) {
    return <div className="error">{`Error: ${error}`}</div>;
  }
  if (!stats || stats.subjects.length === 0) {
    return <div><div className="eyebrow" style={{
        color: "#7b6757"
      }}>Attendance Snapshot</div><h2>Student Dashboard</h2><p>No attendance records found.</p><p>Overall Attendance: 0%</p></div>;
  }
  return <div><div className="eyebrow" style={{
      color: "#7b6757"
    }}>Attendance Snapshot</div><h2>Student Dashboard</h2><div className="dashboard-grid"><div className="stat-card"><div className="stat-label">Overall Attendance</div><div className="stat-value" style={{
          color: stats.overallPercentage > 75 ? "#18794e" : "#c0392b"
        }}>{`${Math.round(stats.overallPercentage)}%`}</div><p>Your current overall attendance percentage.</p></div></div><h3>Daily Attendance Summary</h3><table style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px"
    }}><thead><tr><th style={{
            border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#f2f2f2"
          }}>Type</th><th style={{
            border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#f2f2f2"
          }}>Present</th><th style={{
            border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#f2f2f2"
          }}>Total</th><th style={{
            border: "1px solid #ddd",
            padding: "12px",
            backgroundColor: "#f2f2f2"
          }}>Percentage</th></tr></thead><tbody>{stats.subjects.map((s, index) => <tr key={index}><td style={{
            border: "1px solid #ddd",
            padding: "12px"
          }}>{s.subjectName}</td><td style={{
            border: "1px solid #ddd",
            padding: "12px"
          }}>{s.presentCount}</td><td style={{
            border: "1px solid #ddd",
            padding: "12px"
          }}>{s.totalCount}</td><td style={{
            border: "1px solid #ddd",
            padding: "12px",
            color: s.percentage > 75 ? "green" : "red",
            fontWeight: "bold"
          }}>{`${s.percentage.toFixed(1)}%`}</td></tr>)}</tbody></table></div>;
}
