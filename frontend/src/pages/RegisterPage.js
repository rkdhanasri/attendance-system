import React, { useState } from "react";
import { registerStudent } from "../api";
export default function RegisterPage(props) {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  function submit(e) {
    e.preventDefault();
    registerStudent(form).then(result => {
      if (result === "success") {
        setSuccess("Registration successful. Login now.");
        setError(null);
        props.onSwitch("login");
      } else {
        setError(result || "Registration failed");
      }
    }).catch(err => setError(err.message || "Registration failed"));
  }
  return <div><section className="auth-card"><div className="eyebrow">Student Access</div><h2>Create your account</h2><p className="auth-copy">Register once, then track attendance and leave requests from one place.</p>{error && <div className="error">{error}</div>}{success && <div className="success">{success}</div>}<form onSubmit={submit}>{["name", "studentId", "email", "username", "password"].map(f => {
          return <div key={f}><label>{f.charAt(0).toUpperCase() + f.slice(1)}</label><input type={f === "password" ? "password" : "text"} value={form[f]} onChange={e => setForm(Object.assign({}, form, {
              [f]: e.target.value
            }))} required /></div>;
        })}<div className="button-row"><button type="submit">Register</button><button type="button" className="button-ghost" onClick={() => props.onSwitch("login")}>Already have account</button></div></form></section></div>;
}
