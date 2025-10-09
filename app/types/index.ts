export type EditableTask = {
  title: string;
  status: string;
  assignedToId: number | null;
  skillIds: number[];
  subtasks: EditableTask[];
};

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
  status: "TODO" | "IN_PROGRESS" | "CANCELLED" | "DONE";
  assignedTo?: Developer;
  skills: Array<{ skill: Skill }>;
  subtasks: Task[];
  parentId?: number | null;
  parent?: Task | null;
};
