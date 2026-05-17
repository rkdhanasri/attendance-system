import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDepartment, createDepartment, updateDepartment } from "../api";
export default function DepartmentFormPage(props) {
  const params = useParams();
  const [department, setDepartment] = useState({
    name: "",
    code: ""
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (props.department && props.department.id) {
      setDepartment({
        ...props.department
      });
    } else if (params.id) {
      getDepartment(params.id).then(data => setDepartment({
        ...data
      })).catch(err => setError(err.message || "Failed to load department"));
    } else {
      setDepartment({
        name: "",
        code: ""
      });
    }
  }, [props.department, params.id]);
  function onSubmit(e) {
    e.preventDefault();
    const action = department.id ? updateDepartment(department.id, department) : createDepartment(department);
    action.then(props.onSaved).catch(err => setError(err.message || "Save failed"));
  }
  return <div><h2>{department.id ? "Edit Department" : "New Department"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Name</label><input type="text" value={department.name} onChange={e => setDepartment(Object.assign({}, department, {
          name: e.target.value
        }))} required /></div><div><label>Code</label><input type="text" value={department.code} onChange={e => setDepartment(Object.assign({}, department, {
          code: e.target.value
        }))} required /></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
