import React, { useState } from "react";
import { login } from "../api";
export default function LoginPage(props) {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  function submit(e) {
    e.preventDefault();
    setError(null);
    login(form).then(user => {
      if (!user || user.error || !user.role) {
        setError("Invalid user name or password");
        return;
      }
      props.onLogin(user);
    }).catch(() => setError("Invalid user name or password"));
  }
  return <div>
    <section className="auth-card">
      <div className="eyebrow">Secure Access</div>
      <h2>Welcome back</h2><p className="auth-copy">Sign in to manage attendance, review records, and keep the day moving.</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input type="text" value={form.username} onChange={e => setForm(Object.assign({}, form, {
            username: e.target.value
          }))} required placeholder="Enter your username" /></div>
        <div><label>Password</label><input type="password" value={form.password} onChange={e => setForm(Object.assign({}, form, {
            password: e.target.value
          }))} required placeholder="Enter your password" /></div>
        <div className="button-row"><button type="submit">Sign In</button></div></form>
    </section></div>;
}
