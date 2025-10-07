import TaskSkill from './TaskSkill';
import StatusSelect from './StatusSelect';
import DeveloperSelect from './DeveloperSelect';
import { TaskWithRelations, DeveloperWithSkills } from '@/app/types/prisma-helpers';

type TaskRowProps = {
  task: TaskWithRelations;
  eligibleDevelopers: DeveloperWithSkills[];
  onStatusChange: (taskId: number, newStatus: string) => Promise<void>;
  onDeveloperAssign: (taskId: number, developerId: number) => Promise<void>;
};

export default function TaskRow({
  task,
  eligibleDevelopers,
  onStatusChange,
  onDeveloperAssign
}: TaskRowProps) {
  return (
    <tr>
      <td className="font-semibold">{task.title}</td>
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
      <td>
        <button className="btn btn-ghost btn-sm">View</button>
      </td>
    </tr>
  );
}