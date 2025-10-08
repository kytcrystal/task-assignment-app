"use client";

import { useState } from "react";
import TaskRow from "./TaskRow";
import {
  TaskWithRelations,
  DeveloperWithSkills,
} from "@/app/types/prisma-helpers";

type TaskTableProps = {
  tasks: TaskWithRelations[];
  developers: DeveloperWithSkills[];
};

export default function TaskTable({
  tasks: initialTasks,
  developers,
}: TaskTableProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [errorMsg, setErrorMsg] = useState("");

  const getEligibleDevelopers = (task: TaskWithRelations) => {
    const taskSkillIds = task.skills.map((ts) => ts.skill.id);
    return developers.filter((dev) => {
      const devSkillIds = dev.skills.map((ds) => ds.skill.id);
      return taskSkillIds.every((id) => devSkillIds.includes(id));
    });
  };

  const updateStatus = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok && data.error) {
        setErrorMsg(data.error);
        return;
      }
      if (res.ok) {
        setTasks(tasks.map((t) => (t.id === taskId ? data : t)));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const assignDeveloper = async (taskId: number, developerId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: developerId }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      } else {
        const error = await res.json();
        setErrorMsg(error.error || "Failed to assign developer");
      }
    } catch (error) {
      console.error("Error assigning developer:", error);
      setErrorMsg("Error assigning developer");
    }
  };
  return (
    <div className="overflow-x-auto">
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
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Skills</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Parent Task</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No tasks found. Create your first task!
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                eligibleDevelopers={getEligibleDevelopers(task)}
                onStatusChange={updateStatus}
                onDeveloperAssign={assignDeveloper}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
