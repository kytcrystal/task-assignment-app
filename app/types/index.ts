export type Skill = {
  id: number;
  name: string;
};

export type Developer = {
  id: number;
  name: string;
  skills: Array<{ skill: Skill }>;
};

export type Task = {
  id: number;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'CANCELLED' | 'DONE';
  assignedTo?: Developer;
  skills: Array<{ skill: Skill }>;
};