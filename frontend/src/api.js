/**
 * @typedef {Object} Student
 * @property {number} id
 * @property {string} studentId
 * @property {string} name
 * @property {string} email
 * @property {Object|null} batch
 * @property {Object|null} teacher
 */
/**
 * @typedef {Object} Subject
 * @property {number} id
 * @property {string} name
 * @property {string} code
 * @property {Object|null} semester
 * @property {Object|null} teacher
 */
/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {number=} status
 * @property {any=} details
 */

import axios from "axios";
const client = axios.create({
  baseURL: "/api"
});
client.interceptors.response.use(response => response, error => {
  let apiError = {
    message: "API request failed",
    status: null,
    details: null
  };
  if (error.response) {
    apiError.status = error.response.status;
    apiError.details = error.response.data;
    apiError.message = error.response.data && error.response.data.message || error.response.statusText || "Unexpected server response";
  } else if (error.request) {
    apiError.message = "No response from server";
    apiError.details = error.request;
  } else {
    apiError.message = error.message || "Unknown request error";
    apiError.details = error;
  }
  return Promise.reject(apiError);
});
function handleApi(promise) {
  return promise.then(res => res.data).catch(err => Promise.reject(err));
}
export function listStudents() {
  return handleApi(client.get("/students"));
}

export function listStudentsPaginated({page = 0, size = 10, sort = 'id,asc'} = {}) {
  const params = new URLSearchParams({page: page.toString(), size: size.toString()});
  if (sort) params.append('sort', sort);
  return handleApi(client.get(`/students?${params}`));
}
export function getStudent(id) {
  return handleApi(client.get(`/students/${id}`));
}
export function createStudent(student) {
  return handleApi(client.post("/students", student));
}
export function updateStudent(id, student) {
  return handleApi(client.put(`/students/${id}`, student));
}
export function deleteStudent(id) {
  return handleApi(client.delete(`/students/${id}`));
}
export function listSubjects() {
  return handleApi(client.get("/subjects"));
}
export function getSubject(id) {
  return handleApi(client.get(`/subjects/${id}`));
}
export function createSubject(subject) {
  return handleApi(client.post("/subjects", subject));
}
export function updateSubject(id, subject) {
  return handleApi(client.put(`/subjects/${id}`, subject));
}
export function deleteSubject(id) {
  return handleApi(client.delete(`/subjects/${id}`));
}
export function listSemesters() {
  return handleApi(client.get("/semesters"));
}
export function getSemester(id) {
  return handleApi(client.get(`/semesters/${id}`));
}
export function createSemester(semester) {
  return handleApi(client.post("/semesters", semester));
}
export function updateSemester(id, semester) {
  return handleApi(client.put(`/semesters/${id}`, semester));
}
export function deleteSemester(id) {
  return handleApi(client.delete(`/semesters/${id}`));
}
export function listBatches() {
  return handleApi(client.get("/batches"));
}
export function getBatch(id) {
  return handleApi(client.get(`/batches/${id}`));
}
export function createBatch(batch) {
  return handleApi(client.post("/batches", batch));
}
export function updateBatch(id, batch) {
  return handleApi(client.put(`/batches/${id}`, batch));
}
export function deleteBatch(id) {
  return handleApi(client.delete(`/batches/${id}`));
}
export function listDepartments() {
  return handleApi(client.get("/departments"));
}
export function getDepartment(id) {
  return handleApi(client.get(`/departments/${id}`));
}
export function createDepartment(department) {
  return handleApi(client.post("/departments", department));
}
export function updateDepartment(id, department) {
  return handleApi(client.put(`/departments/${id}`, department));
}
export function deleteDepartment(id) {
  return handleApi(client.delete(`/departments/${id}`));
}
export function listLeaves() {
  return handleApi(client.get("/leaves"));
}
export function getLeave(id) {
  return handleApi(client.get(`/leaves/${id}`));
}
export function createLeave(leave) {
  return handleApi(client.post("/leaves", leave));
}
export function updateLeave(id, leave) {
  return handleApi(client.put(`/leaves/${id}`, leave));
}
export function approveLeave(id) {
  return handleApi(client.put(`/leaves/${id}/approve`));
}
export function rejectLeave(id) {
  return handleApi(client.put(`/leaves/${id}/reject`));
}
export function deleteLeave(id) {
  return handleApi(client.delete(`/leaves/${id}`));
}
export function listTeachers() {
  return handleApi(client.get("/users"));
}
export function listTeacherUsers() {
  return handleApi(client.get("/teachers"));
}

export function listTeacherUsersPaginated({page = 0, size = 10, sort = 'id,asc'} = {}) {
  const params = new URLSearchParams({page: page.toString(), size: size.toString()});
  if (sort) params.append('sort', sort);
  return handleApi(client.get(`/teachers?${params}`));
}
export function listUsers() {
  return handleApi(client.get("/users"));
}

export function listUsersPaginated({page = 0, size = 11, sort = 'id,asc'} = {}) {
  const params = new URLSearchParams({page: page.toString(), size: size.toString()});
  if (sort) params.append('sort', sort);
  return handleApi(client.get(`/users?${params}`));
}
export function getUser(id) {
  return handleApi(client.get(`/users/${id}`));
}
export function createUser(user) {
  return handleApi(client.post("/users", user));
}
export function updateUser(id, user) {
  return handleApi(client.put(`/users/${id}`, user));
}
export function deleteUser(id) {
  return handleApi(client.delete(`/users/${id}`));
}
export function createTeacher(teacher) {
  return handleApi(client.post("/teachers", teacher));
}
export function getTeacher(id) {
  return handleApi(client.get(`/teachers/${id}`));
}
export function updateTeacher(id, teacher) {
  return handleApi(client.put(`/teachers/${id}`, teacher));
}
export function listAttendance() {
  return handleApi(client.get("/attendance"));
}
export function createAttendance(attendance) {
  return handleApi(client.post("/attendance", attendance));
}
export function deleteAttendance(id) {
  return handleApi(client.delete(`/attendance/${id}`));
}
export function registerStudent(form) {
  return handleApi(client.post("/auth/register", form));
}
export function listStudentLeaves(studentId) {
  return handleApi(client.get(`/leaves/student/${studentId}`));
}
export function listTeacherStudents(teacherId) {
  return handleApi(client.get(`/teachers/${teacherId}/students`));
}
export function listTeacherSubjects(teacherId) {
  return handleApi(client.get(`/subjects/teacher/${teacherId}`));
}
export function getStudentAttendanceStats(studentId) {
  return handleApi(client.get(`/attendance/student/${studentId}/stats`));
}
export function login(form) {
  return handleApi(client.post("/auth/login", form));
}
