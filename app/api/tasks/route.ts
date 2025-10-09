import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { detectSkillsFromTitle } from "@/lib/llm";
import { TaskStatus } from "@prisma/client";

type TaskPayload = {
  title: string;
  status?: TaskStatus;
  assignedToId?: number | null;
  skillIds?: number[];
  subtasks?: TaskPayload[];
  parentId?: number | null;
};

export async function GET(request: NextRequest) {
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

async function createTaskRecursive(
  data: TaskPayload,
  skillIds: number[],
  parentId: number | null = null
) {
  const { title, status = "TODO", subtasks = [], assignedToId = null } = data;
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
  for (const skillId of skillIds) {
    await prisma.taskSkill.create({
      data: { taskId: task.id, skillId },
    });
  }

  // Recursively create subtasks
  for (const subtask of subtasks) {
    let subtaskSkillIds = subtask.skillIds;
    if (!subtaskSkillIds || subtaskSkillIds.length === 0) {
      subtaskSkillIds = await detectSkillsFromTitle(subtask.title);
    }
    await createTaskRecursive(subtask, subtaskSkillIds, task.id);
  }

  return task;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, skillIds } = body;

    let finalSkillIds = skillIds;
    if (!skillIds || skillIds.length === 0) {
      console.log(`No skills provided. Using LLM to detect for: "${title}"`);
      finalSkillIds = await detectSkillsFromTitle(title);
      console.log(`LLM detected skill IDs: ${finalSkillIds}`);
    }

    const mainTask = await createTaskRecursive(body, finalSkillIds);

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
