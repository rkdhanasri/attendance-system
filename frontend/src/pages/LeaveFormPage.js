import React, { useEffect, useState } from "react";
import { listStudents, createLeave } from "../api";
export default function LeaveFormPage(props) {
  const [leaveRequest, setLeaveRequest] = useState({
    student: null,
    reason: "",
    startDate: "",
    endDate: ""
  });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    listStudents().then(setStudents).catch(err => setError(err.message || "Cannot load students"));
  }, []);
  function onSubmit(e) {
    e.preventDefault();
    const payload = {
      student: {
        id: leaveRequest.student?.id
      },
      reason: leaveRequest.reason,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      status: "PENDING"
    };
    createLeave(payload).then(props.onSaved).catch(err => setError(err.message || "Failed to request leave"));
  }
  return <div><h2>Apply Leave</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Student</label><select value={leaveRequest.student ? leaveRequest.student.id : ""} onChange={e => setLeaveRequest(Object.assign({}, leaveRequest, {
          student: students.find(s => String(s.id) === e.target.value) || null
        }))}><option value="">-- choose student --</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div><label>Reason</label><input type="text" value={leaveRequest.reason} onChange={e => setLeaveRequest(Object.assign({}, leaveRequest, {
          reason: e.target.value
        }))} required /></div><div><label>Start Date</label><input type="date" value={leaveRequest.startDate} onChange={e => setLeaveRequest(Object.assign({}, leaveRequest, {
          startDate: e.target.value
        }))} required /></div><div><label>End Date</label><input type="date" value={leaveRequest.endDate} onChange={e => setLeaveRequest(Object.assign({}, leaveRequest, {
          endDate: e.target.value
        }))} required /></div><button type="submit">Submit</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
