import React, { useEffect, useState } from "react";
import { listSemesters, deleteSemester } from "../api";
export default function SemestersPage(props) {
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    load();
  }, []);
  function load() {
    listSemesters().then(setSemesters).catch(err => setError(err.message || "Cannot load semesters"));
  }
  function onDelete(id) {
    if (!window.confirm("Delete this semester?")) return;
    deleteSemester(id).then(() => load()).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Semesters</h2><button onClick={() => props.onAdd()}>New Semester</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Name</th><th>Number</th><th>Actions</th></tr></thead><tbody>{semesters.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.number}</td><td><button onClick={() => props.onEdit(s)}>Edit</button> <button onClick={() => onDelete(s.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
