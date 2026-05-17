import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTeacher, updateTeacher, getTeacher } from "../api";
export default function TeacherFormPage(props) {
  const params = useParams();
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    designation: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadTeacher() {
      if (props.teacher && props.teacher.id) {
        setTeacher({
          id: props.teacher.id,
          name: props.teacher.name || "",
          email: props.teacher.email || "",
          designation: props.teacher.designation || "",
          username: props.teacher.username || "",
          password: ""
        });
      } else if (params.id) {
        const data = await getTeacher(params.id);
        if (data) setTeacher(data);
      } else {
        setTeacher({
          name: "",
          email: "",
          designation: "",
          username: "",
          password: ""
        });
      }
    }
    loadTeacher();
  }, [props.teacher, params.id]);
  function onSubmit(e) {
    e.preventDefault();
    const body = {
      name: teacher.name,
      email: teacher.email,
      designation: teacher.designation,
      username: teacher.username,
      password: teacher.password || "secret"
    };
    const action = teacher.id ? updateTeacher(teacher.id, body) : createTeacher(body);
    action.then(() => props.onSaved()).catch(err => setError(err.message || "Save failed"));
  }
  return <div><h2>{teacher.id ? "Edit Teacher" : "New Teacher"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Name</label><input type="text" value={teacher.name} required onChange={e => setTeacher(Object.assign({}, teacher, {
          name: e.target.value
        }))} /></div><div><label>Email</label><input type="email" value={teacher.email} required onChange={e => setTeacher(Object.assign({}, teacher, {
          email: e.target.value
        }))} /></div><div><label>Designation</label><input type="text" value={teacher.designation} onChange={e => setTeacher(Object.assign({}, teacher, {
          designation: e.target.value
        }))} /></div><div><label>Username</label><input type="text" value={teacher.username} required onChange={e => setTeacher(Object.assign({}, teacher, {
          username: e.target.value
        }))} /></div><div><label>Password</label><input type="password" value={teacher.password} onChange={e => setTeacher(Object.assign({}, teacher, {
          password: e.target.value
        }))} /></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
