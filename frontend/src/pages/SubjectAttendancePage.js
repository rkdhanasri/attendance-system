import React, { useEffect, useState } from "react";
import { listAttendance, createAttendance, deleteAttendance, listTeacherStudents, listStudents } from "../api";
export default function SubjectAttendancePage({
  user
}) {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setError(null);
    const isTeacher = user && user.role && user.role.toUpperCase() === "TEACHER";
    try {
      if (isTeacher) {
        if (!user.teacher || !user.teacher.id) {
          setStudents([]);
          setAttendance([]);
          setError("Teacher profile is missing. Please log in again.");
          return;
        }
        const teacherStudents = await listTeacherStudents(user.teacher.id);
        setStudents(teacherStudents);
        const attendanceResult = await listAttendance();
        const studentIds = teacherStudents.map(student => student.id);
        const filteredAtt = attendanceResult.filter(record => record.student && studentIds.includes(record.student.id));
        setAttendance(filteredAtt);
      } else {
        const [allStudents, att] = await Promise.all([listStudents(), listAttendance()]);
        setStudents(allStudents);
        setAttendance(att);
      }
    } catch (err) {
      setStudents([]);
      setAttendance([]);
      setError(err.message || "Could not load attendance page.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [user]);
  if (loading) return <div>Loading attendance...</div>;
  const isTeacher = user && user.role && user.role.toUpperCase() === "TEACHER";
  const attendanceForDate = attendance.filter(record => record.date === selectedDate);
  function recordForStudent(studentId, present) {
    createAttendance({
      studentId,
      date: selectedDate,
      present
    }).then(load).catch(err => setError(err.message || "Record failed"));
  }
  function onDelete(id) {
    deleteAttendance(id).then(load).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Daily Attendance</h2>{isTeacher ? <p>{`Your students (${students.length}). Mark attendance for ${selectedDate}.`}</p> : <p>Attendance by day.</p>}{error && <div className="error">{error}</div>}<div><label>Attendance Date </label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} /></div>{isTeacher && students.length === 0 && <div>No students assigned to you.</div>}{isTeacher && students.length > 0 && <table className="table"><thead><tr><th>Student</th><th>Current Status</th><th>Present</th><th>Absent</th></tr></thead><tbody>{students.map(s => {
          const existing = attendanceForDate.find(record => record.student && record.student.id === s.id);
          return <tr key={s.id}><td>{s.name}</td><td>{existing ? existing.present ? "Present" : "Absent" : "Not marked"}</td><td><button onClick={() => recordForStudent(s.id, true)}>Present</button></td><td><button onClick={() => recordForStudent(s.id, false)}>Absent</button></td></tr>;
        })}</tbody></table>}<h3>Attendance Records</h3><table className="table"><thead><tr><th>ID</th><th>Student</th><th>Date</th><th>Present</th><th>Action</th></tr></thead><tbody>{attendance.map(a => <tr key={a.id}><td>{a.id}</td><td>{a.student ? a.student.name : ""}</td><td>{a.date}</td><td>{a.present ? "Yes" : "No"}</td><td><button onClick={() => onDelete(a.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
