
import { Prisma } from '@prisma/client';

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    assignedTo: {
      include: {
        skills: {
          include: {
            skill: true;
          };
        };
      };
    };
    skills: {
      include: {
        skill: true;
      };
    };
    subtasks: {
      include: {
        assignedTo: {
          include: {
            skills: {
              include: {
                skill: true;
              };
            };
          };
        };
        skills: {
          include: {
            skill: true;
          };
        };
      };
    };
  };
}>;

export type DeveloperWithSkills = Prisma.DeveloperGetPayload<{
  include: {
    skills: {
      include: {
        skill: true;
      };
    };
  };
}>;