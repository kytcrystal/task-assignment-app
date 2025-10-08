import { Prisma } from '@prisma/client';
import { Task } from '@prisma/client';

type DeveloperWithSkills = {
  id: number;
  name: string;
  skills: Array<{ skillId: number }>;
};

type TaskWithSkills = {
  id: number;
  title: string;
  skills: Array<{ skillId: number }>;
};


export function canDeveloperDoTask(
  developer: DeveloperWithSkills,
  task: TaskWithSkills
): boolean {
  const devSkillIds = developer.skills.map(s => s.skillId);
  const taskSkillIds = task.skills.map(s => s.skillId);
  
  return taskSkillIds.every(skillId => devSkillIds.includes(skillId));
}

export function getEligibleDevelopers(
  developers: DeveloperWithSkills[],
  task: TaskWithSkills
): DeveloperWithSkills[] {
  return developers.filter(dev => canDeveloperDoTask(dev, task));
}

/**
 * Check if a task can be marked as DONE
 * A task can only be DONE if all its subtasks are DONE
 */
export function canMarkTaskAsDone(
  task: Task & { subtasks?: Task[] }
): { canChange: boolean; reason?: string } {
  // If task has no subtasks, it can always be marked DONE
  if (!task.subtasks || task.subtasks.length === 0) {
    return { canChange: true };
  }

  // Check if all subtasks are DONE
  const allSubtasksDone = task.subtasks.every(subtask => subtask.status === 'DONE');

  if (!allSubtasksDone) {
    const pendingCount = task.subtasks.filter(st => st.status !== 'DONE').length;
    return {
      canChange: false,
      reason: `Cannot mark as DONE: ${pendingCount} subtask(s) are not completed`
    };
  }

  return { canChange: true };
}

/**
 * Recursively check if a task and ALL nested subtasks can be marked DONE
 */
export function canMarkTaskAsDoneRecursive(
  task: Task & { subtasks?: Array<Task & { subtasks?: Task[] }> }
): { canChange: boolean; reason?: string } {
  if (!task.subtasks || task.subtasks.length === 0) {
    return { canChange: true };
  }

  // Check each subtask recursively
  for (const subtask of task.subtasks) {
    const subtaskCheck = canMarkTaskAsDoneRecursive(subtask);
    if (!subtaskCheck.canChange) {
      return {
        canChange: false,
        reason: `Subtask "${subtask.title}" or its subtasks are not completed`
      };
    }

    if (subtask.status !== 'DONE') {
      return {
        canChange: false,
        reason: `Subtask "${subtask.title}" is not marked as DONE`
      };
    }
  }

  return { canChange: true };
}