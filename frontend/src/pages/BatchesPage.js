import React, { useEffect, useState } from "react";
import { listBatches, deleteBatch } from "../api";
export default function BatchesPage(props) {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    load();
  }, []);
  function load() {
    listBatches().then(setBatches).catch(err => setError(err.message || "Cannot load batches"));
  }
  function onDelete(id) {
    if (!window.confirm("Delete this batch?")) return;
    deleteBatch(id).then(() => load()).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Batches</h2><button onClick={() => props.onAdd()}>New Batch</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Name</th><th>Year</th><th>Department</th><th>Actions</th></tr></thead><tbody>{batches.map(batch => <tr key={batch.id}><td>{batch.id}</td><td>{batch.name}</td><td>{batch.year}</td><td>{batch.department ? batch.department.name : ""}</td><td><button onClick={() => props.onEdit(batch)}>Edit</button> <button onClick={() => onDelete(batch.id)}>Delete</button></td></tr>)}</tbody></table></div>;
}
