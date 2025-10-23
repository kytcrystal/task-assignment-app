import TaskSkill from "./TaskSkill";
import StatusSelect from "./StatusSelect";
import DeveloperSelect from "./DeveloperSelect";
import {
  TaskWithRelations,
  DeveloperWithSkills,
} from "@/app/types/prisma-helpers";

type TaskRowProps = {
  task: TaskWithRelations;
  eligibleDevelopers: DeveloperWithSkills[];
  onStatusChange: (taskId: number, newStatus: string) => Promise<void>;
  onDeveloperAssign: (taskId: number, developerId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  indentLevel?: number;
};

export default function TaskRow({
  task,
  eligibleDevelopers,
  onStatusChange,
  onDeveloperAssign,
  onDelete,
}: TaskRowProps) {
  return (
    <>
      <tr>
        <td>{task.id}</td>
        <td className="font-semibold ml-2 w-1/2">{task.title}</td>
        <td>
          <TaskSkill skills={task.skills} />
        </td>
        <td>
          <StatusSelect
            taskId={task.id}
            currentStatus={task.status}
            onStatusChange={onStatusChange}
          />
        </td>
        <td>
          <DeveloperSelect
            taskId={task.id}
            currentDeveloperId={task.assignedTo?.id}
            eligibleDevelopers={eligibleDevelopers}
            onDeveloperAssign={onDeveloperAssign}
          />
        </td>
        <td>{task.parentId}</td>
        <td>
          <button className="btn" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
