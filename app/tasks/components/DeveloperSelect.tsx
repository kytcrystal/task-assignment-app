import { DeveloperWithSkills } from "@/app/types/prisma-helpers";

type DeveloperSelectProps = {
  taskId: number;
  currentDeveloperId?: number;
  eligibleDevelopers: DeveloperWithSkills[];
  onDeveloperAssign: (taskId: number, developerId: number) => Promise<void>;
};

export default function DeveloperSelect({
  taskId,
  currentDeveloperId,
  eligibleDevelopers,
  onDeveloperAssign
}: DeveloperSelectProps) {
  return (
    <div>
      <select
        className="select select-bordered select-sm w-full"
        value={currentDeveloperId || ''}
        onChange={(e) => {
          const devId = parseInt(e.target.value);
          if (devId) onDeveloperAssign(taskId, devId);
        }}
      >
        <option value="">Unassigned</option>
        {eligibleDevelopers.map(dev => (
          <option key={dev.id} value={dev.id}>
            {dev.name}
          </option>
        ))}
      </select>
      {eligibleDevelopers.length === 0 && (
        <span className="text-error text-xs block mt-1">
          No eligible developers
        </span>
      )}
    </div>
  );
}