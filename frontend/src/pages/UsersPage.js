import React, { useEffect, useState } from "react";
import { listUsersPaginated, deleteUser } from "../api";
import Pagination from "../components/Pagination";
export default function UsersPage(props) {
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0, totalElements: 0 });
  const [error, setError] = useState(null);
  const pageSize = 11;
  async function fetchPage(page = 0) {
    try {
      setError(null);
      const response = await listUsersPaginated({ page, size: pageSize });
      const allUsers = (response.content || []).map(u => u);
      setUsers(allUsers);
      setPageInfo({
        currentPage: response.number || 0,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0
      });
    } catch (err) {
      setError(err.message || "Cannot load users");
    }
  }
  useEffect(() => {
    fetchPage(0);
  }, []);
  function onDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    deleteUser(id).then(() => fetchPage(pageInfo.currentPage)).catch(err => setError(err.message || "Delete failed"));
  }
  const visibleUsers = users.filter(u => !u.mainAdmin);
  const totalVisible = pageInfo.totalElements - 1; // approximate, since mainAdmin filtered client-side
  return <div>
    <h2>Users</h2>
    <button onClick={() => props.onAdd ? props.onAdd() : alert("Add user action is not implemented")}>New User</button>
    {error && <div className="error">{error}</div>}
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {visibleUsers.map(u => <tr key={u.id}>
          <td>{u.id}</td>
          <td>{u.username}</td>
          <td>{u.role}</td>
          <td>{u.role !== "ADMIN" && <button onClick={() => props.onEdit ? props.onEdit(u) : alert("Edit user action is not implemented")}>Edit</button>}{u.role !== "ADMIN" && " "}<button onClick={() => onDelete(u.id)}>Delete</button>
          </td>
        </tr>)}
        {visibleUsers.length === 0 && <tr>
          <td colSpan={4}>No subadmins found.</td>
        </tr>}
      </tbody>
    </table>
    <Pagination currentPage={pageInfo.currentPage} totalPages={pageInfo.totalPages} onPageChange={fetchPage} pageSize={pageSize} />
  </div>;
}
