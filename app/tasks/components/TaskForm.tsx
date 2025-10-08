import TaskEditor from "./TaskEditor";
import { useState } from "react";

export default function TaskForm({ developers, onSubmit }: any) {
  const [task, setTask] = useState({
    title: "",
    status: "TODO",
    assignedToId: null,
    skills: [],
    subtasks: [],
  });
  const handleChange = (updated: any) => setTask(updated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TaskEditor numbering="1" value={task} onChange={handleChange} />
      <div className="flex justify-end">
        <button type="submit" className="btn">
          Create Task
        </button>
      </div>
    </form>
  );
}
