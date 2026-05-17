import React, { useEffect, useState } from "react";
import { listStudentLeaves, getUser } from "../api";
export default function StudentLeavesPage({
  user,
  onAdd
}) {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      if (!user || !user.id) {
        setError("Student info not loaded");
        setLoading(false);
        return;
      }
      let studentId = user.student?.id;
      if (!studentId) {
        try {
          const fresh = await getUser(user.id);
          if (fresh && fresh.student && fresh.student.id) {
            studentId = fresh.student.id;
          } else {
            throw new Error("No associated student record found");
          }
        } catch (err) {
          setError("Student info not loaded");
          setLoading(false);
          return;
        }
      }
      listStudentLeaves(studentId).then(setLeaves).catch(err => setError(err.message || "Cannot load my leaves")).finally(() => setLoading(false));
    }
    load();
  }, [user]);
  if (loading) return <div>Loading...</div>;
  return <div><h2>My Leaves</h2><button className="btn btn-success" onClick={() => onAdd()}>Apply for Leave</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>Reason</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead><tbody>{leaves.length === 0 ? <tr><td colSpan={4} className="text-center">No leave requests.</td></tr> : leaves.map(leave => <tr key={leave.id}><td>{leave.reason}</td><td>{leave.startDate}</td><td>{leave.endDate}</td><td><span className={`badge badge-${leave.status.toLowerCase()}`}>{leave.status}</span></td></tr>)}</tbody></table></div>;
}
