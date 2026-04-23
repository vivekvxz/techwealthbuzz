import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Initial fetch
    axios.get("http://localhost:8080/api/tasks")
      .then(res => setTasks(res.data));

    // Connect WebSocket
    const socket = new WebSocket("ws://localhost:8080/ws/tasks");

    socket.onmessage = (event) => {
      const task = JSON.parse(event.data);
      setTasks(prev => [...prev, task]);
    };

    return () => socket.close();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    await axios.post("http://localhost:8080/api/tasks", {
      title: newTask,
      status: "Pending"
    });
    setNewTask("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📡 Native WebSocket Task Tracker</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter Task"
        />
        <button className="bg-green-600 text-white px-4 py-2">Add</button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="border p-2">{task.id}</td>
              <td className="border p-2">{task.title}</td>
              <td className="border p-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;