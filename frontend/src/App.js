import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentsPage from "./pages/StudentsPage";
import StudentFormPage from "./pages/StudentFormPage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectFormPage from "./pages/SubjectFormPage";
import BatchesPage from "./pages/BatchesPage";
import BatchFormPage from "./pages/BatchFormPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentFormPage from "./pages/DepartmentFormPage";
import SemestersPage from "./pages/SemestersPage";
import SemesterFormPage from "./pages/SemesterFormPage";
import TeachersPage from "./pages/TeachersPage";
import TeacherFormPage from "./pages/TeacherFormPage";
import UsersPage from "./pages/UsersPage";
import LeavesPage from "./pages/LeavesPage";
import LeaveFormPage from "./pages/LeaveFormPage";
import SubjectAttendancePage from "./pages/SubjectAttendancePage";
import UserFormPage from "./pages/UserFormPage";
import StudentLeavesPage from "./pages/StudentLeavesPage";
import StudentLeaveFormPage from "./pages/StudentLeaveFormPage";
function AppRoutes({
  user,
  setUser
}) {
  const navigate = useNavigate();
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  function dashboardPathForRole(role) {
    if (role === "TEACHER") return "/teacher";
    if (role === "STUDENT") return "/student";
    return "/admin";
  }
  function hasRole(required) {
    if (!user || !user.role) return false;
    const role = user.role.toUpperCase();
    return role === required;
  }
  function canManageAdmins() {
    return hasRole("ADMIN") && !!user?.mainAdmin;
  }
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Toggle function
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const navBar = user ? <div className="nav">{hasRole("ADMIN") && <button onClick={() => navigate("/admin")}>Admin</button>}{
    // Admin should not see teacher/student attendance/leave dashboards
    hasRole("ADMIN") && <button onClick={() => navigate("/students")}>Students</button>}{hasRole("ADMIN") && <button onClick={() => navigate("/subjects")}>Subjects</button>}{hasRole("ADMIN") && <button onClick={() => navigate("/batches")}>Batches</button>}{hasRole("ADMIN") && <button onClick={() => navigate("/departments")}>Departments</button>}{hasRole("ADMIN") && <button onClick={() => navigate("/semesters")}>Semesters</button>}{hasRole("ADMIN") && <button onClick={() => navigate("/teachers")}>Teachers</button>}{canManageAdmins() && <button onClick={() => navigate("/users")}>Users</button>}{hasRole("TEACHER") && <button onClick={() => navigate("/teacher")}>Teacher</button>}{hasRole("STUDENT") && <button onClick={() => navigate("/student")}>Student</button>}{hasRole("TEACHER") && <button onClick={() => navigate("/attendance")}>Attendance</button>}{hasRole("TEACHER") && <button onClick={() => navigate("/leaves")}>Leaves</button>}{hasRole("STUDENT") && <button onClick={() => navigate("/student/leaves")}>Leaves</button>}<button onClick={() => {
      setUser(null);
      localStorage.removeItem("attendanceUser");
      navigate("/login");
    }}>Logout</button></div> : null;
  function requireAuth(element) {
    if (!user) return <Navigate to="/login" replace />;
    return element;
  }
  function requireGuest(element) {
    if (user) return <Navigate to={dashboardPathForRole(user.role)} replace />;
    return element;
  }
  function requireRole(role, element) {
    if (!user) return <Navigate to="/login" replace />;
    if (!hasRole(role)) return <Navigate to={dashboardPathForRole(user.role)} replace />;
    return element;
  }
  function requireMainAdmin(element) {
    if (!user) return <Navigate to="/login" replace />;
    if (!canManageAdmins()) return <Navigate to={dashboardPathForRole(user.role)} replace />;
    return element;
  }
  function onLogin(userData) {
    setUser(userData);
    navigate(dashboardPathForRole(userData.role?.toUpperCase()));
  }
  function roleLabel() {
    if (!user?.role) return "Welcome";
    if (user.role.toUpperCase() === "ADMIN") {
      return user.mainAdmin ? "Main Admin Workspace" : "Sub Admin Workspace";
    }
    if (user.role.toUpperCase() === "TEACHER") return "Teacher Workspace";
    if (user.role.toUpperCase() === "STUDENT") return "Student Workspace";
    return "Attendance Workspace";
  }
  return <div className="app-shell">
    <div className="bg-orb orb-one" />
    <div className="bg-orb orb-two" />
    <div className="bg-grid" />
    <div className="app-container">{user && <header className="app-header">
      <div className="app-header-copy">
        <div className="eyebrow">{roleLabel()}</div>
        <h1>Attendance System</h1>
        <p>A cleaner daily workflow for admins, teachers, and students.</p>
        </div>
        <div style={{
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}><button onClick={toggleTheme} className="theme-toggle">{darkMode ? "☀️" : "🌙"}</button>
        <div className="app-user-chip">{user.username || "Signed in"}</div>
        </div></header>}{navBar}<main className={user ? "content-shell" : "content-shell auth-shell"}>
          <Routes>
            <Route path="/login" element={requireGuest(<LoginPage onLogin={onLogin} onSwitch={p => navigate(`/${p}`)} />)} />
              <Route path="/register" element={requireGuest(<RegisterPage onSwitch={p => navigate(`/${p}`)} />)} />
                <Route path="/admin" element={requireRole("ADMIN", <AdminDashboard />)} />
                <Route path="/teacher" element={requireRole("TEACHER", <TeacherDashboard user={user} />)} />
                <Route path="/student" element={requireRole("STUDENT", <StudentDashboard user={user} />)} />
                <Route path="/student/leaves" element={requireRole("STUDENT", <StudentLeavesPage user={user} onAdd={() => navigate("/student/apply-leave")} />)} />
                <Route path="/student/apply-leave" element={requireRole("STUDENT", <StudentLeaveFormPage user={user} onSaved={() => navigate("/student/leaves")} onCancel={() => navigate("/student/leaves")} />)} />
                <Route path="/students" element={requireRole("ADMIN", <StudentsPage onAdd={() => {
            setEditingStudent(null);
            navigate("/students/new");
          }} onEdit={s => {
            setEditingStudent(s);
            navigate(`/students/edit/${s.id}`);
          }} />)} /><Route path="/students/new" element={requireRole("ADMIN", <StudentFormPage student={null} onSaved={() => navigate("/students")} onCancel={() => navigate("/students")} />)} /><Route path="/students/edit/:id" element={requireRole("ADMIN", <StudentFormPage student={editingStudent} onSaved={() => {
            setEditingStudent(null);
            navigate("/students");
          }} onCancel={() => {
            setEditingStudent(null);
            navigate("/students");
          }} />)} /><Route path="/subjects" element={requireRole("ADMIN", <SubjectsPage onAdd={() => {
            setEditingSubject(null);
            navigate("/subjects/new");
          }} onEdit={s => {
            setEditingSubject(s);
            navigate(`/subjects/edit/${s.id}`);
          }} />)} /><Route path="/subjects/new" element={requireRole("ADMIN", <SubjectFormPage subject={null} onSaved={() => navigate("/subjects")} onCancel={() => navigate("/subjects")} />)} /><Route path="/subjects/edit/:id" element={requireRole("ADMIN", <SubjectFormPage subject={editingSubject} onSaved={() => {
            setEditingSubject(null);
            navigate("/subjects");
          }} onCancel={() => {
            setEditingSubject(null);
            navigate("/subjects");
          }} />)} /><Route path="/batches" element={requireRole("ADMIN", <BatchesPage onAdd={() => {
            setEditingBatch(null);
            navigate("/batches/new");
          }} onEdit={b => {
            setEditingBatch(b);
            navigate(`/batches/edit/${b.id}`);
          }} />)} /><Route path="/batches/new" element={requireRole("ADMIN", <BatchFormPage batch={null} onSaved={() => navigate("/batches")} onCancel={() => navigate("/batches")} />)} /><Route path="/batches/edit/:id" element={requireRole("ADMIN", <BatchFormPage batch={editingBatch} onSaved={() => {
            setEditingBatch(null);
            navigate("/batches");
          }} onCancel={() => {
            setEditingBatch(null);
            navigate("/batches");
          }} />)} /><Route path="/departments" element={requireRole("ADMIN", <DepartmentsPage onAdd={() => {
            setEditingDepartment(null);
            navigate("/departments/new");
          }} onEdit={d => {
            setEditingDepartment(d);
            navigate(`/departments/edit/${d.id}`);
          }} />)} /><Route path="/departments/new" element={requireRole("ADMIN", <DepartmentFormPage department={null} onSaved={() => navigate("/departments")} onCancel={() => navigate("/departments")} />)} /><Route path="/departments/edit/:id" element={requireRole("ADMIN", <DepartmentFormPage department={editingDepartment} onSaved={() => {
            setEditingDepartment(null);
            navigate("/departments");
          }} onCancel={() => {
            setEditingDepartment(null);
            navigate("/departments");
          }} />)} /><Route path="/semesters" element={requireRole("ADMIN", <SemestersPage onAdd={() => {
            setEditingSemester(null);
            navigate("/semesters/new");
          }} onEdit={s => {
            setEditingSemester(s);
            navigate(`/semesters/edit/${s.id}`);
          }} />)} /><Route path="/semesters/new" element={requireRole("ADMIN", <SemesterFormPage semester={null} onSaved={() => navigate("/semesters")} onCancel={() => navigate("/semesters")} />)} /><Route path="/semesters/edit/:id" element={requireRole("ADMIN", <SemesterFormPage semester={editingSemester} onSaved={() => {
            setEditingSemester(null);
            navigate("/semesters");
          }} onCancel={() => {
            setEditingSemester(null);
            navigate("/semesters");
          }} />)} /><Route path="/teachers" element={requireRole("ADMIN", <TeachersPage onAdd={() => {
            setEditingTeacher(null);
            navigate("/teachers/new");
          }} onEdit={t => {
            setEditingTeacher(t);
            navigate(`/teachers/edit/${t.id}`);
          }} />)} /><Route path="/teachers/new" element={requireRole("ADMIN", <TeacherFormPage teacher={null} onSaved={() => navigate("/teachers")} onCancel={() => navigate("/teachers")} />)} /><Route path="/teachers/edit/:id" element={requireRole("ADMIN", <TeacherFormPage teacher={editingTeacher} onSaved={() => {
            setEditingTeacher(null);
            navigate("/teachers");
          }} onCancel={() => {
            setEditingTeacher(null);
            navigate("/teachers");
          }} />)} /><Route path="/users" element={requireMainAdmin(<UsersPage user={user} onAdd={() => {
            navigate("/users/new");
          }} onEdit={u => {
            navigate(`/users/edit/${u.id}`);
          }} />)} /><Route path="/users/new" element={requireMainAdmin(<UserFormPage user={null} onSaved={() => navigate("/users")} onCancel={() => navigate("/users")} />)} /><Route path="/users/edit/:id" element={requireMainAdmin(<UserFormPage onSaved={() => navigate("/users")} onCancel={() => navigate("/users")} />)} /><Route path="/leaves" element={requireRole("TEACHER", <LeavesPage />)} /><Route path="/leaves/new" element={requireRole("STUDENT", <LeaveFormPage onSaved={() => navigate("/leaves")} onCancel={() => navigate("/leaves")} />)} /><Route path="/attendance" element={requireRole("TEACHER", <SubjectAttendancePage user={user} />)} /><Route path="*" element={<Navigate to={user ? dashboardPathForRole(user.role) : "/login"} replace />} /></Routes></main></div></div>;
}
export default function App() {
  const [savedUser, setSavedUser] = useState(() => {
    const stored = localStorage.getItem("attendanceUser");
    return stored ? JSON.parse(stored) : null;
  });
  function saveUser(user) {
    if (user) {
      localStorage.setItem("attendanceUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("attendanceUser");
    }
    setSavedUser(user);
  }
  return <BrowserRouter><AppRoutes user={savedUser} setUser={saveUser} /></BrowserRouter>;
}
