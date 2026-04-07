import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/"
})



export const createTask = (taskData) => API.post("api/create_task", taskData)
export const getAllTasks = () => API.get("api/get_tasks")
export const getTaskById = (id) =>
  API.get(`api/tasks/${id}`);
export const deleteTask = (id) => API.delete(`api/tasks/${id}`);
export const updateTaskStatus = (id, status) =>
  API.put(`api/tasks/${id}/status?status=${encodeURIComponent(status)}`);
