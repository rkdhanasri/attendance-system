import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listBatches, listTeacherUsers, createStudent, getStudent, updateStudent, registerStudent } from "../api";
export default function StudentFormPage(props) {
  const params = useParams();
  const [student, setStudent] = useState({
    id: "",
    studentId: "",
    name: "",
    email: "",
    batchId: "",
    teacherId: "",
    username: "",
    password: ""
  });
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    listBatches().then(setBatches).catch(e => setError(e.message || "Cannot load batches"));
    listTeacherUsers().then(setTeachers).catch(e => setError(e.message || "Cannot load teachers"));
    if (props.student && props.student.id) {
      getStudent(props.student.id).then(data => {
        setStudent({
          id: data.id,
          studentId: data.studentId || "",
          name: data.name || "",
          email: data.email || "",
          batchId: data.batch ? data.batch.id : "",
          teacherId: data.teacher ? data.teacher.id : "",
          username: "",
          password: ""
        });
      }).catch(e => setError(e.message || "Failed to load"));
    } else if (params.id) {
      getStudent(params.id).then(data => {
        setStudent({
          id: data.id,
          studentId: data.studentId || "",
          name: data.name || "",
          email: data.email || "",
          batchId: data.batch ? data.batch.id : "",
          teacherId: data.teacher ? data.teacher.id : "",
          username: "",
          password: ""
        });
      }).catch(e => setError(e.message || "Failed to load"));
    } else {
      setStudent({
        id: "",
        studentId: "",
        name: "",
        email: "",
        batchId: "",
        teacherId: "",
        username: "",
        password: ""
      });
    }
  }, [props.student, params.id]);
  function onSubmit(e) {
    e.preventDefault();
    if (student.id) {
      updateStudent(student.id, {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        batch: student.batchId ? {
          id: Number(student.batchId)
        } : null,
        teacher: student.teacherId ? {
          id: Number(student.teacherId)
        } : null
      }).then(() => props.onSaved()).catch(err => setError(err.message || "Save failed"));
    } else {
      createStudent({
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        batch: student.batchId ? {
          id: Number(student.batchId)
        } : null,
        teacher: student.teacherId ? {
          id: Number(student.teacherId)
        } : null
      }).then(newStudent => {
        return registerStudent({
          name: student.name,
          studentId: student.studentId,
          email: student.email,
          username: student.username,
          password: student.password
        });
      }).then(regResult => {
        if (regResult && regResult.indexOf && regResult.indexOf("success") === -1 || regResult !== "success") {
          setError(typeof regResult === "string" ? regResult : "Registration failed");
          return;
        }
        props.onSaved();
      }).catch(err => setError(err.message || "Save failed"));
    }
  }
  function updateField(field, value) {
    setStudent(Object.assign({}, student, {
      [field]: value
    }));
  }
  return <div><h2>{params.id || props.student && props.student.id ? "Edit Student" : "New Student"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Student ID</label><input type="text" value={student.studentId || ""} onChange={e => updateField("studentId", e.target.value)} required /></div><div><label>Name</label><input type="text" value={student.name || ""} onChange={e => updateField("name", e.target.value)} required /></div><div><label>Email</label><input type="email" value={student.email || ""} onChange={e => updateField("email", e.target.value)} required /></div><div><label>Batch</label><select value={student.batchId || ""} onChange={e => updateField("batchId", e.target.value)}><option value="">-- none --</option>{batches.map(b => <option key={b.id} value={b.id}>{b.name || b.batchName || `Batch ${b.id}`}</option>)}</select></div><div><label>Teacher</label><select value={student.teacherId || ""} onChange={e => updateField("teacherId", e.target.value)}><option value="">-- none --</option>{teachers.filter(t => t.teacher && t.teacher.id).map(t => <option key={t.id} value={t.teacher.id}>{t.teacher && t.teacher.name || t.username || `Teacher ${t.id}`}</option>)}</select></div>{!student.id && <><div><label>Username</label><input type="text" value={student.username || ""} onChange={e => updateField("username", e.target.value)} required /></div><div><label>Password</label><input type="password" value={student.password || ""} onChange={e => updateField("password", e.target.value)} required /></div></>}<button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
