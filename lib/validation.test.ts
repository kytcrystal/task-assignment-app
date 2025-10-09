import { TaskStatus } from "@prisma/client";
import { describe, it, expect } from "vitest";
import {
  canDeveloperDoTask,
  getEligibleDevelopers,
  canMarkTaskAsDone,
  canMarkTaskAsDoneRecursive,
} from "./validation";

describe("canDeveloperDoTask", () => {
  it("should return true when developer has all required skills", () => {
    const developer = {
      id: 1,
      name: "Alice",
      skills: [{ skillId: 1 }], // Frontend
    };

    const task = {
      id: 1,
      title: "Build homepage",
      skills: [{ skillId: 1 }], // Needs Frontend
    };

    expect(canDeveloperDoTask(developer, task)).toBe(true);
  });

  it("should return false when developer lacks required skills", () => {
    const developer = {
      id: 1,
      name: "Alice",
      skills: [{ skillId: 1 }], // Only Frontend
    };

    const task = {
      id: 1,
      title: "Build API",
      skills: [{ skillId: 2 }], // Needs Backend
    };

    expect(canDeveloperDoTask(developer, task)).toBe(false);
  });

  it("should return true when developer has both skills for full-stack task", () => {
    const developer = {
      id: 3,
      name: "Carol",
      skills: [{ skillId: 1 }, { skillId: 2 }], // Frontend + Backend
    };

    const task = {
      id: 1,
      title: "Full-stack feature",
      skills: [{ skillId: 1 }, { skillId: 2 }], // Needs both
    };

    expect(canDeveloperDoTask(developer, task)).toBe(true);
  });

  it("should return false when developer only has one of two required skills", () => {
    const developer = {
      id: 1,
      name: "Alice",
      skills: [{ skillId: 1 }], // Only Frontend
    };

    const task = {
      id: 1,
      title: "Full-stack feature",
      skills: [{ skillId: 1 }, { skillId: 2 }], // Needs both
    };

    expect(canDeveloperDoTask(developer, task)).toBe(false);
  });
});

describe("getEligibleDevelopers", () => {
  const developers = [
    { id: 1, name: "Alice", skills: [{ skillId: 1 }] }, // Frontend
    { id: 2, name: "Bob", skills: [{ skillId: 2 }] }, // Backend
    { id: 3, name: "Carol", skills: [{ skillId: 1 }, { skillId: 2 }] }, // Both
  ];

  it("should return all developers with Frontend skill", () => {
    const task = {
      id: 1,
      title: "Build homepage",
      skills: [{ skillId: 1 }], // Frontend
    };

    const eligible = getEligibleDevelopers(developers, task);
    expect(eligible.map((d) => d.name)).toEqual(["Alice", "Carol"]);
  });

  it("should return only Carol for full-stack task", () => {
    const task = {
      id: 1,
      title: "Full-stack feature",
      skills: [{ skillId: 1 }, { skillId: 2 }], // Both
    };

    const eligible = getEligibleDevelopers(developers, task);
    expect(eligible.map((d) => d.name)).toEqual(["Carol"]);
  });

  it("should return empty array when no developers match", () => {
    const task = {
      id: 1,
      title: "DevOps task",
      skills: [{ skillId: 999 }], // Non-existent skill
    };

    const eligible = getEligibleDevelopers(developers, task);
    expect(eligible).toEqual([]);
  });
});

describe("canMarkTaskAsDone", () => {
  it("should allow DONE if no subtasks", () => {
    const task = {
      id: 1,
      title: "Solo",
      status: TaskStatus.TODO,
      assignedToId: null,
      parentId: null,
    };
    expect(canMarkTaskAsDone(task)).toEqual({ canChange: true });
  });

  it("should allow DONE if all subtasks are DONE", () => {
    const task = {
      id: 2,
      title: "Parent",
      status: TaskStatus.TODO,
      assignedToId: null,
      parentId: null,
      subtasks: [
        {
          id: 3,
          title: "Sub1",
          status: TaskStatus.DONE,
          assignedToId: null,
          parentId: null,
        },
        {
          id: 4,
          title: "Sub2",
          status: TaskStatus.DONE,
          assignedToId: null,
          parentId: null,
        },
      ],
    };
    expect(canMarkTaskAsDone(task)).toEqual({ canChange: true });
  });

  it("should not allow DONE if some subtasks are not DONE", () => {
    const task = {
      id: 5,
      title: "Parent",
      status: TaskStatus.TODO,
      assignedToId: null,
      parentId: null,
      subtasks: [
        {
          id: 6,
          title: "Sub1",
          status: TaskStatus.DONE,
          assignedToId: null,
          parentId: null,
        },
        {
          id: 7,
          title: "Sub2",
          status: TaskStatus.TODO,
          assignedToId: null,
          parentId: null,
        },
      ],
    };
    expect(canMarkTaskAsDone(task)).toEqual({
      canChange: false,
      reason: "Cannot mark as DONE: 1 subtask(s) are not completed",
    });
  });
});
