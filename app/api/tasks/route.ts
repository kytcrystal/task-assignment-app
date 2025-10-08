import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { detectSkillsFromTitle } from "@/lib/llm";

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

async function createTaskRecursive(
  data: any,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, skillIds, parentId } = body;
    
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
