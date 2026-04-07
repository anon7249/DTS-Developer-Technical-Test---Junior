import CreateTaskForm from "./components/createTaskForm";
import { useEffect, useState } from "react";
import {
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTaskStatus,
} from "./api/api";
import Banner from "./components/Banner";

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState("");

  const statusOptions = ["pending", "todo", "in progress", "done"];

  const fetchTasks = async () => {
    const response = await getAllTasks();
    setTasks(response.data);
  };

  const handleCancel = () => {
    setSearchId("");
    setSelectedTask(null);
    setError("");
  };

  const handleSearch = async () => {
    if (!searchId) return;

    try {
      const response = await getTaskById(searchId);
      setSelectedTask(response.data);
      setError("");
    } catch (err) {
      setSelectedTask(null);
      setError("Task not found");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);

      if (selectedTask && selectedTask.id === id) {
        handleCancel();
      }

      await fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateTaskStatus(id, newStatus);

      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(response.data);
      }

      await fetchTasks();
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <Banner />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="mt-6">
          <CreateTaskForm onSuccess={fetchTasks} />
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="number"
            placeholder="Enter Task ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Search
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 rounded"
          >
            Cancel
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <h2 className="text-xl font-semibold mt-10 mb-3">
          {selectedTask ? "Selected Task" : "All Tasks"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedTask ? (
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900">
                {selectedTask.title}
              </h3>

              {selectedTask.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {selectedTask.description}
                </p>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 mt-3 gap-4">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      handleStatusChange(selectedTask.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm text-gray-700"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <span>
                  Due:{" "}
                  {new Date(selectedTask.due_at).toLocaleDateString("en-GB")}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleDelete(selectedTask.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
              >
                <h3 className="font-semibold text-lg text-gray-900">
                  {t.title}
                </h3>

                {t.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {t.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mt-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <select
                      value={t.status}
                      onChange={(e) =>
                        handleStatusChange(t.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm text-gray-700"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span>
                    Due: {new Date(t.due_at).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
