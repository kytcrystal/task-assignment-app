
import { prisma } from '@/lib/prisma';
import TaskTable from './components/TaskTable';

export const dynamic = 'force-dynamic';

async function getTasks() {
  const tasks = await prisma.task.findMany({
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
      },
      subtasks: {
        include: {
          assignedTo: {
            include: {
              skills: { include: { skill: true } }
            }
          },
          skills: { include: { skill: true } }
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  return tasks;
}

async function getDevelopers() {
  const developers = await prisma.developer.findMany({
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    }
  });

  return developers;
}

export default async function TaskListPage() {
  const [tasks, developers] = await Promise.all([
    getTasks(),
    getDevelopers()
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task List</h1>
      </div>

      <TaskTable tasks={tasks} developers={developers} />
    </div>
  );
}