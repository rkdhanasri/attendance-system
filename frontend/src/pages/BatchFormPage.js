import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBatch, createBatch, updateBatch, listDepartments } from "../api";
export default function BatchFormPage(props) {
  const params = useParams();
  const [batch, setBatch] = useState({
    name: "",
    year: "",
    department: null
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    listDepartments().then(setDepartments).catch(err => setError(err.message || "Cannot load departments"));
    if (props.batch && props.batch.id) {
      setBatch({
        id: props.batch.id,
        name: props.batch.name || "",
        year: props.batch.year || "",
        department: props.batch.department || null
      });
    } else if (params.id) {
      getBatch(params.id).then(data => {
        setBatch({
          id: data.id,
          name: data.name || "",
          year: data.year || "",
          department: data.department || null
        });
      }).catch(err => setError(err.message || "Failed to load batch"));
    } else {
      setBatch({
        name: "",
        year: "",
        department: null
      });
    }
  }, [props.batch, params.id]);
  const onChange = (field, value) => {
    setBatch(Object.assign({}, batch, {
      [field]: value
    }));
  };
  function onSubmit(e) {
    e.preventDefault();
    const payload = {
      name: batch.name,
      year: Number(batch.year),
      department: batch.department ? {
        id: batch.department.id
      } : null
    };
    const action = batch.id ? updateBatch(batch.id, payload) : createBatch(payload);
    action.then(props.onSaved).catch(err => setError(err.message || "Save failed"));
  }
  return <div><h2>{batch.id ? "Edit Batch" : "New Batch"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Name</label><input type="text" required value={batch.name} onChange={e => onChange("name", e.target.value)} /></div><div><label>Year</label><input type="number" required value={batch.year} onChange={e => onChange("year", e.target.value)} /></div><div><label>Department</label><select value={batch.department ? batch.department.id : ""} onChange={e => onChange("department", departments.find(d => String(d.id) === e.target.value) || null)}><option value="">-- none --</option>{departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}</select></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
