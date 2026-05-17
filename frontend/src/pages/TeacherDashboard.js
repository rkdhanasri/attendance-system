import React from "react";
import { useEffect, useState } from "react";
import { listTeacherStudents } from "../api";
export default function TeacherDashboard({
  user
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user?.teacher?.id) {
      listTeacherStudents(user.teacher.id).then(setStudents).catch(err => setError(err.message)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);
  if (loading) return <div>Loading your students...</div>;
  return <div><div className="eyebrow" style={{
      color: "#7b6757"
    }}>Teaching Overview</div><h2>Teacher Dashboard</h2>{error && <div className="error">{error}</div>}<div className="dashboard-grid"><div className="stat-card"><div className="stat-label">Assigned Students</div><div className="stat-value">{String(students.length)}</div><p>Keep track of the students currently assigned to you.</p></div><div className="stat-card"><div className="stat-label">Next Step</div><div className="stat-value">Daily Attendance</div><p>Open the attendance page to mark today’s presence in one pass.</p></div></div>{students.length === 0 && <div>No students assigned to you yet. Ask admin to assign students.</div>}{students.length > 0 && <div><p>{`You have ${students.length} assigned students. Use the `}<a href="/attendance">Attendance page</a> to mark present or absent for the day.</p><table className="table"><thead><tr><th>Student ID</th><th>Name</th><th>Email</th></tr></thead><tbody>{students.map(s => <tr key={s.id}><td>{s.studentId}</td><td>{s.name}</td><td>{s.email}</td></tr>)}</tbody></table></div>}</div>;
}
