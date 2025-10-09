import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import {
  canDeveloperDoTask,
  canMarkTaskAsDoneRecursive,
} from "@/lib/validation";
import { Task } from "@prisma/client";

type TaskWithSubtasks = Task & { subtasks: TaskWithSubtasks[] };

// Recursive fetch for all subtasks
async function fetchTaskWithAllSubtasks(taskId: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subtasks: true },
  });
  if (!task) return null;
  async function fetchSubtasks(subtasks: Task[]): Promise<TaskWithSubtasks[]> {
    const results = await Promise.all(
      subtasks.map(async (subtask) => {
        const fullSubtask = await prisma.task.findUnique({
          where: { id: subtask.id },
          include: { subtasks: true },
        });
        if (fullSubtask) {
          fullSubtask.subtasks = await fetchSubtasks(fullSubtask.subtasks);
          return fullSubtask as TaskWithSubtasks;
        }
        return null;
      })
    );
    return results.filter(
      (subtask): subtask is TaskWithSubtasks => subtask !== null
    );
  }
  task.subtasks = await fetchSubtasks(task.subtasks);
  return task as TaskWithSubtasks;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const taskId = Number(params.id);
    const task = await fetchTaskWithAllSubtasks(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { status, assignedToId } = body;
    const taskId = Number(params.id);

    if (status === "DONE") {
      const task = await fetchTaskWithAllSubtasks(taskId);
      if (task) {
        const validation = canMarkTaskAsDoneRecursive(task);
        if (!validation.canChange) {
          return NextResponse.json(
            { error: validation.reason },
            { status: 400 }
          );
        }
      }
    }

    if (assignedToId) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          skills: true,
        },
      });

      const developer = await prisma.developer.findUnique({
        where: { id: assignedToId },
        include: {
          skills: true,
        },
      });

      if (!task || !developer) {
        return NextResponse.json(
          { error: "Task or developer not found" },
          { status: 404 }
        );
      }

      if (!canDeveloperDoTask(developer, task)) {
        return NextResponse.json(
          { error: "Developer does not have required skills" },
          { status: 400 }
        );
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(assignedToId && { assignedToId }),
      },
      include: {
        assignedTo: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
