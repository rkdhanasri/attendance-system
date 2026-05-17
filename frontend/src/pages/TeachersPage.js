import React, { useEffect, useState } from "react";
import { listTeacherUsersPaginated, deleteUser } from "../api";
import Pagination from "../components/Pagination";
export default function TeachersPage(props) {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const pageSize = 10;
  useEffect(() => {
    load();
  }, [currentPage]);
  function load() {
    listTeacherUsersPaginated({page: currentPage, size: pageSize}).then(data => {
      setTeachers(data.content || []);
      setTotalPages(data.totalPages || 0);
    }).catch(err => setError(err.message || "Cannot load teachers"));
  }
  function onPageChange(page) {
    setCurrentPage(page);
  }
  function onDelete(id) {
    if (!window.confirm("Delete this teacher?")) return;
    deleteUser(id).then(() => {
      if (teachers.length === 1 && currentPage > 0) {
        setCurrentPage(Math.max(0, currentPage - 1));
      } else {
        load();
      }
    }).catch(err => setError(err.message || "Delete failed"));
  }
  return <div><h2>Teachers</h2><button onClick={() => props.onAdd()}>New Teacher</button>{error && <div className="error">{error}</div>}<table className="table"><thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Designation</th><th>Actions</th></tr></thead><tbody>{teachers.map(t => <tr key={t.id}><td>{t.id}</td><td>{t.username}</td><td>{t.teacher ? t.teacher.name : ""}</td><td>{t.teacher ? t.teacher.email : ""}</td><td>{t.teacher ? t.teacher.designation : ""}</td><td><button onClick={() => props.onEdit(t)}>Edit</button> <button onClick={() => onDelete(t.id)}>Delete</button></td></tr>)}</tbody></table><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} pageSize={pageSize} /></div>;
}
