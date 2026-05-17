import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSemester, createSemester, updateSemester } from "../api";
export default function SemesterFormPage(props) {
  const params = useParams();
  const [semester, setSemester] = useState({
    name: "",
    number: ""
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (props.semester && props.semester.id) {
      setSemester({
        ...props.semester
      });
    } else if (params.id) {
      getSemester(params.id).then(data => setSemester({
        ...data
      })).catch(err => setError(err.message || "Failed to load semester"));
    } else {
      setSemester({
        name: "",
        number: ""
      });
    }
  }, [props.semester, params.id]);
  function onSubmit(e) {
    e.preventDefault();
    const payload = {
      name: semester.name,
      number: Number(semester.number)
    };
    const action = semester.id ? updateSemester(semester.id, payload) : createSemester(payload);
    action.then(props.onSaved).catch(err => setError(err.message || "Save failed"));
  }
  return <div><h2>{semester.id ? "Edit Semester" : "New Semester"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Name</label><input type="text" value={semester.name} onChange={e => setSemester(Object.assign({}, semester, {
          name: e.target.value
        }))} required /></div><div><label>Number</label><input type="number" value={semester.number} onChange={e => setSemester(Object.assign({}, semester, {
          number: e.target.value
        }))} required /></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
