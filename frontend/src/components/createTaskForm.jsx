import { useEffect, useState } from "react";
import { createTask } from "../api/api";

function CreateTaskForm({
  initialData = {},
  buttonLabel = "Create Task",
  onSuccess,
}) {
  const [taskData, setTaskData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? "pending",
    due_at: initialData?.due_at ?? "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setTaskData({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        status: initialData.status ?? "pending",
        due_at: initialData.due_at ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const payload = {
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status,
        due_at: taskData.due_at,
      };

      await createTask(payload);

      setSuccessMessage(`Task ${payload.title} was created successfully.`);

      if (onSuccess) {
        onSuccess();
      }

      setTaskData({
        title: "",
        description: "",
        status: "pending",
        due_at: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <div className="mb-3">
          <label
            className="block text-xs font-medium text-gray-700 mb-1"
            htmlFor="title"
          >
            Title *
          </label>

          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-2 py-1.5 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-xs font-medium text-gray-700 mb-1"
            htmlFor="description"
          >
            Description (optional)
          </label>

          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-2 py-1.5 rounded-md text-sm h-20 resize-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-xs font-medium text-gray-700 mb-1"
            htmlFor="status"
          >
            Status *
          </label>

          <select
            id="status"
            name="status"
            value={taskData.status}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-2 py-1.5 rounded-md text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="todo">Todo</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="mb-3">
          <label
            className="block text-xs font-medium text-gray-700 mb-1"
            htmlFor="due_at"
          >
            Due date *
          </label>

          <input
            id="due_at"
            type="date"
            name="due_at"
            value={taskData.due_at}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-2 py-1.5 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <p className="mt-2 text-sm text-green-600">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer bg-blue-950 text-white text-sm p-1.5 rounded-sm"
        >
          {submitting ? "Saving..." : buttonLabel}
        </button>
      </form>
    </div>
  );
}

export default CreateTaskForm;
