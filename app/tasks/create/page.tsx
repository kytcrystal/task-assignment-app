"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../components/TaskForm";

export default function CreateTaskPage() {
  const router = useRouter();
  const [developers, setDevelopers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/developers")
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (payload: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create task");
      router.push("/tasks");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create task");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
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
      <h1 className="text-3xl font-bold mb-6">Create Task</h1>
      <TaskForm developers={developers} onSubmit={handleSubmit} />
    </div>
  );
}
