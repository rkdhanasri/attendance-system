import React, { useEffect, useState } from "react";
import { listDepartments, deleteDepartment } from "../api";
export default function DepartmentsPage(props) {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    load();
  }, []);
  function load() {
    listDepartments().then(setDepartments).catch(err => setError(err.message || "Cannot load departments"));
  }
  function onDelete(id) {
    if (!window.confirm("Delete this department?")) return;
    deleteDepartment(id).then(() => load()).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Departments</h2><button onClick={() => props.onAdd()}>New Department</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Name</th><th>Code</th><th>Actions</th></tr></thead><tbody>{departments.map(dept => <tr key={dept.id}><td>{dept.id}</td><td>{dept.name}</td><td>{dept.code}</td><td><button onClick={() => props.onEdit(dept)}>Edit</button> <button onClick={() => onDelete(dept.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
