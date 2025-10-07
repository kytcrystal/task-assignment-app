import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { canDeveloperDoTask } from '@/lib/validation';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, assignedToId } = body;
    const taskId = Number(params.id);

    if (assignedToId) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          skills: true
        }
      });

      const developer = await prisma.developer.findUnique({
        where: { id: assignedToId },
        include: {
          skills: true
        }
      });

      if (!task || !developer) {
        return NextResponse.json(
          { error: 'Task or developer not found' },
          { status: 404 }
        );
      }

      if (!canDeveloperDoTask(developer, task)) {
        return NextResponse.json(
          { error: 'Developer does not have required skills' },
          { status: 400 }
        );
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(assignedToId && { assignedToId })
      },
      include: {  
        assignedTo: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        skills: {
          include: {
            skill: true
          }
        }
      }
    });


    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
