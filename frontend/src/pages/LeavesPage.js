import React, { useEffect, useState } from "react";
import { listLeaves, approveLeave, rejectLeave, deleteLeave } from "../api";
export default function LeavesPage(props) {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    load();
  }, []);
  function load() {
    listLeaves().then(setLeaves).catch(err => setError(err.message || "Cannot load leaves"));
  }
  function onApprove(id) {
    approveLeave(id).then(load).catch(err => setError(err.message || "Approve failed"));
  }
  function onReject(id) {
    rejectLeave(id).then(load).catch(err => setError(err.message || "Reject failed"));
  }
  function onDelete(id) {
    if (!window.confirm("Delete this leave request?")) return;
    deleteLeave(id).then(load).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Leaves</h2>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Student</th><th>Reason</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead><tbody>{leaves.map(l => <tr key={l.id}><td>{l.id}</td><td>{l.student ? l.student.name : ""}</td><td>{l.reason}</td><td>{l.startDate}</td><td>{l.endDate}</td><td>{l.status}</td><td><button onClick={() => onApprove(l.id)}>Approve</button> <button onClick={() => onReject(l.id)}>Reject</button> <button onClick={() => onDelete(l.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
