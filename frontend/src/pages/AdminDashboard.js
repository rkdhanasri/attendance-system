import React from "react";
export default function AdminDashboard(props) {
  return <div><div className="eyebrow" style={{
      color: "#7b6757"
    }}>Control Center</div><h2>Admin Dashboard</h2><p>Manage students, teachers, departments, semesters, and every core record from one unified workspace.</p><div className="dashboard-grid"><div className="stat-card"><div className="stat-label">Operations</div><div className="stat-value">Centralized</div><p>Use the navigation above to create, update, and review institutional data.</p></div><div className="stat-card"><div className="stat-label">Role</div><div className="stat-value">ADMIN</div><p>You are in the admin workspace with access to management tools.</p></div></div></div>;
}
