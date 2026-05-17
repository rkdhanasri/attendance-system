import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createUser, getUser, updateUser } from "../api";
export default function UserFormPage(props) {
  const params = useParams();
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "ADMIN"
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (props.user && props.user.id) {
      getUser(props.user.id).then(data => setUser(data)).catch(e => setError(e.message || "Failed to load"));
    } else if (params.id) {
      getUser(params.id).then(data => setUser(data)).catch(e => setError(e.message || "Failed to load"));
    } else {
      setUser({
        username: "",
        password: "",
        role: "ADMIN"
      });
    }
  }, [props.user, params.id]);
  function onSubmit(e) {
    e.preventDefault();
    const action = user.id ? updateUser(user.id, user) : createUser(user);
    action.then(() => props.onSaved()).catch(err => setError(err.message || "Save failed"));
  }
  function updateField(field, value) {
    setUser(Object.assign({}, user, {
      [field]: value
    }));
  }
  return <div><h2>{user.id ? "Edit User" : "New User"}</h2>{error && <div className="error">{error}</div>}<form onSubmit={onSubmit}><div><label>Username</label><input type="text" value={user.username || ""} onChange={e => updateField("username", e.target.value)} required /></div><div><label>Password</label><input type="password" value={user.password || ""} onChange={e => updateField("password", e.target.value)} placeholder={user.id ? "Leave empty to keep current password" : "Enter password"} required={!user.id} /></div><div><label>Role</label><input type="text" value="ADMIN" disabled /><input type="hidden" name="role" value="ADMIN" /></div><button type="submit">Save</button> <button type="button" onClick={props.onCancel}>Cancel</button></form></div>;
}
