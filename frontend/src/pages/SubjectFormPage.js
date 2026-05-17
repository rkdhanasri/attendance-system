import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSubject, getSubject, updateSubject, listSemesters, listTeacherUsers } from "../api";
export default function SubjectFormPage(props) {
  const params = useParams();
  const [subject, setSubject] = useState({
    name: "",
    code: "",
    semester: null,
    teacher: null
  });
  const [semesters, setSemesters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    listSemesters().then(setSemesters).catch(e => setError(e.message || "Cannot load semesters"));
    listTeacherUsers().then(setTeachers).catch(e => setError(e.message || "Cannot load teachers"));
    if (props.subject && props.subject.id) {
      getSubject(props.subject.id).then(data => {
        setSubject({
          id: data.id,
          name: data.name || "",
          code: data.code || "",
          semester: data.semester ? {
            id: data.semester.id,
            name: data.semester.name
          } : null,
          teacher: data.teacher ? {
            id: data.teacher.id,
            name: data.teacher.name
          } : null
        });
      }).catch(e => setError(e.message || "Load failed"));
    } else if (params.id) {
      getSubject(params.id).then(data => {
        setSubject({
          id: data.id,
          name: data.name || "",
          code: data.code || "",
          semester: data.semester ? {
            id: data.semester.id,
            name: data.semester.name
          } : null,
          teacher: data.teacher ? {
            id: data.teacher.id,
            name: data.teacher.name
          } : null
        });
      }).catch(e => setError(e.message || "Load failed"));
    } else {
      setSubject({
        name: "",
        code: "",
        semester: null,
        teacher: null
      });
    }
  }, [props.subject, params.id]);
  function setField(field, value) {
    setSubject(Object.assign({}, subject, {
      [field]: value
    }));
  }
  function onSubmit(e) {
    e.preventDefault();
    const payload = {
      name: subject.name,
      code: subject.code,
      semester: subject.semester ? {
        id: subject.semester.id
      } : null,
      teacher: subject.teacher ? {
        id: subject.teacher.id
      } : null
    };
    const action = subject.id ? updateSubject(subject.id, payload) : createSubject(payload);
    action.then(() => props.onSaved()).catch(err => setError(err.message || "Save failed"));
  }
  return <div><h2>{subject.id ? "Edit Subject" : "New Subject"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Name</label><input type="text" value={subject.name || ""} onChange={e => setField("name", e.target.value)} required /></div><div><label>Code</label><input type="text" value={subject.code || ""} onChange={e => setField("code", e.target.value)} required /></div><div><label>Semester</label><select value={subject.semester ? subject.semester.id : ""} onChange={e => {
          const semesterId = e.target.value;
          const chosen = semesters.find(s => String(s.id) === String(semesterId));
          setField("semester", chosen || null);
        }}><option value="">-- choose --</option>{semesters.map(s => <option key={s.id} value={s.id}>{s.name + " (" + s.number + ")"}</option>)}</select></div><div><label>Teacher</label><select value={subject.teacher ? subject.teacher.id : ""} onChange={e => {
          const teacherId = e.target.value;
          const chosen = teachers.find(u => String(u.teacher ? u.teacher.id : u.id) === String(teacherId));
          setField("teacher", chosen && chosen.teacher ? {
            id: chosen.teacher.id,
            name: chosen.teacher.name
          } : null);
        }}><option value="">-- choose --</option>{teachers.map(t => <option key={t.id} value={t.teacher ? t.teacher.id : t.id}>{t.teacher && t.teacher.name || t.username || "Untitled"}</option>)}</select></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
