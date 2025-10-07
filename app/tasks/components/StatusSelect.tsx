import { TaskStatus } from '@prisma/client';

type StatusSelectProps = {
  taskId: number;
  currentStatus: TaskStatus;
  onStatusChange: (taskId: number, newStatus: string) => Promise<void>;
};

export default function StatusSelect({ 
  taskId, 
  currentStatus, 
  onStatusChange 
}: StatusSelectProps) {
  return (
    <select
      className="select select-bordered select-sm"
      value={currentStatus}
      onChange={(e) => onStatusChange(taskId, e.target.value)}
    >
      <option value="TODO">To Do</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="DONE">Done</option>
    </select>
  );
}