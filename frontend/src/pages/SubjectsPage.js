import React, { useEffect, useState } from "react";
import { listSubjects, deleteSubject } from "../api";
export default function SubjectsPage(props) {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  function load() {
    listSubjects().then(setSubjects).catch(e => setError(e.message || "Failed to load"));
  }
  useEffect(() => {
    load();
  }, []);
  function doDelete(id) {
    if (!window.confirm("Delete this subject?")) return;
    deleteSubject(id).then(() => load()).catch(e => setError(e.message || "Delete failed"));
  }
  return <div><h2>Subjects</h2><button onClick={() => props.onAdd()}>New Subject</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Name</th><th>Code</th><th>Semester</th><th>Teacher</th><th>Actions</th></tr></thead><tbody>{subjects.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.code}</td><td>{s.semester ? s.semester.name + " (" + s.semester.number + ")" : ""}</td><td>{s.teacher ? s.teacher.name : ""}</td><td><button onClick={() => props.onEdit(s)}>Edit</button> <button onClick={() => doDelete(s.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
