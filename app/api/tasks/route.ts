import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        skills: { include: { skill: true } },
        assignedTo: true,
      },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

async function createTaskRecursive(data: any, parentId: number | null = null) {
  const {
    title,
    status = "TODO",
    skills = [],
    subtasks = [],
    assignedToId = null,
  } = data;
  // Create the main task
  const task = await prisma.task.create({
    data: {
      title,
      status,
      assignedToId,
      parentId,
    },
  });

  // Link skills
  for (const s of skills) {
    const skill = await prisma.skill.upsert({
      where: { name: s },
      update: {},
      create: { name: s },
    });
    await prisma.taskSkill.create({
      data: { taskId: task.id, skillId: skill.id },
    });
  }

  // Recursively create subtasks
  for (const subtask of subtasks) {
    await createTaskRecursive(subtask, task.id);
  }

  return task;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mainTask = await createTaskRecursive(body);

    const created = await prisma.task.findUnique({
      where: { id: mainTask.id },
      include: {
        skills: { include: { skill: true } },
        assignedTo: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
