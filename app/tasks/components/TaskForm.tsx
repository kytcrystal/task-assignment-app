import { EditableTask } from "@/app/types";
import TaskEditor from "./TaskEditor";
import { useState } from "react";

type TaskFormProps = {
  onSubmit: (task: EditableTask) => void;
};

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [task, setTask] = useState<EditableTask>({
    title: "",
    status: "TODO",
    assignedToId: null,
    skillIds: [],
    subtasks: [],
  });
  const handleChange = (updated: EditableTask) => setTask(updated);
  const [errorMsg, setErrorMsg] = useState("");

  function allTitlesFilled(task: { title: string; subtasks?: EditableTask[] }) {
    if (!task.title || task.title.trim() === "") return false;
    if (task.subtasks && task.subtasks.length > 0) {
      return task.subtasks.every(allTitlesFilled);
    }
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allTitlesFilled(task)) {
      setErrorMsg("All tasks and subtasks must have a non-empty title.");
      return;
    }
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div role="alert" className="alert alert-error alert-soft mb-4">
          <span>{errorMsg}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setErrorMsg("")}
          >
            ✕
          </button>
        </div>
      )}
      <TaskEditor numbering="1" value={task} onChange={handleChange} />
      <div className="flex justify-end">
        <button type="submit" className="btn">
          Create Task
        </button>
      </div>
    </form>
  );
}
