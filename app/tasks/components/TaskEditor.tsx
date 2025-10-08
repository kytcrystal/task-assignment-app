"use client";
import React, { useState } from "react";
import SkillSelect from "./SkillSelect";

type TaskEditorProps = {
  numbering: string;
  onChange: (task: any) => void;
  value?: any;
};

export default function TaskEditor({
  numbering,
  onChange,
  value = {},
}: TaskEditorProps) {
  const [task, setTask] = useState(
    value || {
      title: "",
      status: "TODO",
      assignedToId: null,
      skills: [],
      subtasks: [],
    }
  );
  const [subtasks, setSubtasks] = useState<any[]>(value.subtasks || []);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, {}]);
  };

  const handleRemoveSubtask = (idx: number) => {
    const updated = subtasks.slice();
    updated.splice(idx, 1);
    setSubtasks(updated);
    onChange({ ...task, subtasks: updated });
  };

  const handleSubtaskChange = (idx: number, subtask: any) => {
    const updated = subtasks.slice();
    updated[idx] = subtask;
    setSubtasks(updated);
    onChange({ ...task, subtasks: updated });
  };

  const update = (updates: any) => {
    const newTask = { ...task, ...updates };
    setTask(newTask);
    onChange({ ...newTask, subtasks });
  };

  React.useEffect(() => {
    onChange({ ...task, subtasks });
  }, [task, subtasks]);

  return (
    <div className="card bg-base-200 p-4 mt-4 border border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">New Task Component {numbering}</span>
      </div>
      <label className="label">
        <span className="label-text font-medium">Title</span>
      </label>
      <div className="form-control mb-2">
        <textarea
          className="textarea w-full"
          value={task.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>

      <SkillSelect
        skills={task.skills ?? []}
        setSkills={(skills: string[]) => update({ skills })}
      />
      <div className="flex justify-end mt-2">
        <button type="button" className="btn" onClick={handleAddSubtask}>
          Add Subtask
        </button>
      </div>

      <div className="pl-4">
        {subtasks.map((sub, idx) => (
          <div key={idx} className="relative">
            <TaskEditor
              numbering={`${numbering}.${idx + 1}`}
              value={sub}
              onChange={(subtask) => handleSubtaskChange(idx, subtask)}
            />
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 rounded-full w-6 h-6 flex items-center justify-center"
              style={{ fontSize: "1rem", lineHeight: 1 }}
              onClick={() => handleRemoveSubtask(idx)}
              aria-label="Remove Subtask"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
