import React, { useState, useEffect } from "react";
import { createLeave, getUser } from "../api";
export default function StudentLeaveFormPage({
  user,
  onSaved,
  onCancel
}) {
  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: ""
  });
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(user ? user.student : null);
  useEffect(() => {
    if (user && user.student) {
      setStudent(user.student);
    } else if (user && user.id) {
      getUser(user.id).then(u => {
        if (u && u.student) {
          setStudent(u.student);
        }
      }).catch(err => {
        console.warn("Could not load student information:", err);
      });
    }
  }, [user]);
  function submit(e) {
    e.preventDefault();
    const studentId = student?.id || user?.student?.id;
    if (!studentId) {
      setError("Student info missing");
      return;
    }
    const leaveData = {
      ...form,
      student: {
        id: studentId
      }
    };
    createLeave(leaveData).then(() => {
      onSaved();
    }).catch(err => setError(err.message || "Failed to submit leave"));
  }
  return <div><h2>Apply for Leave</h2>{student ? <div className="student-info">Student: {student.name} ({student.studentId})</div> : <div className="error">Student information not available.</div>}{error && <div className="error">{error}</div>}<form onSubmit={submit}><div><label>Reason</label><input type="text" value={form.reason} onChange={e => setForm({
          ...form,
          reason: e.target.value
        })} required /></div><div><label>Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({
          ...form,
          startDate: e.target.value
        })} required /></div><div><label>End Date</label><input type="date" value={form.endDate} onChange={e => setForm({
          ...form,
          endDate: e.target.value
        })} required /></div><div><button type="submit">Submit Leave Request</button> <button type="button" onClick={onCancel}>Cancel</button></div></form></div>;
}
