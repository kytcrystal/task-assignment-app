import { Prisma } from '@prisma/client';

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
