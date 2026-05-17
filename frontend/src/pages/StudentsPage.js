import React, { useEffect, useState } from "react";
import { listStudentsPaginated, deleteStudent } from "../api";
import Pagination from "../components/Pagination";
export default function StudentsPage(props) {
  const [students, setStudents] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0, totalElements: 0 });
  const [error, setError] = useState(null);
  const pageSize = 10;
  async function fetchPage(page = 0) {
    try {
      setError(null);
      const response = await listStudentsPaginated({ page, size: pageSize });
      setStudents(response.content || []);
      setPageInfo({
        currentPage: response.number || 0,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0
      });
    } catch (e) {
      setError(e.message || "Failed to load");
    }
  }
  useEffect(() => {
    fetchPage(0);
  }, []);
  function doDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    deleteStudent(id).then(() => fetchPage(pageInfo.currentPage)).catch(e => setError(e.message || "Delete failed"));
  }
  return <div>
    <h2>Students</h2>
    <button onClick={() => props.onAdd()}>New Student</button>
    {error && <div className="error">{error}</div>}
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Student ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s =>
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.studentId}</td>
            <td>{s.name}</td>
            <td>{s.email}</td>
            <td><button onClick={() => props.onEdit(s)}>Edit</button>
              <button onClick={() => doDelete(s.id)}>Delete</button></td>
          </tr>)}
      </tbody>
    </table>
    <Pagination currentPage={pageInfo.currentPage} totalPages={pageInfo.totalPages} onPageChange={fetchPage} pageSize={pageSize} />
  </div>;
}
