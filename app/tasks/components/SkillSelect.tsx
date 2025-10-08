import { useState } from "react";

interface Skill {
  id: number;
  name: string;
}

interface SkillSelectProps {
  availableSkills: Skill[];
  skillIds: number[];
  setSkillIds: (ids: number[]) => void;
}

export default function SkillSelect({
  availableSkills,
  skillIds,
  setSkillIds,
}: SkillSelectProps) {
  const [selectedId, setSelectedId] = useState<number>(
    availableSkills[0]?.id ?? 0
  );

  const addSkill = () => {
    if (selectedId && !skillIds.includes(selectedId)) {
      setSkillIds([...skillIds, selectedId]);
    }
  };

  const removeSkill = (id: number) => {
    setSkillIds(skillIds.filter((s) => s !== id));
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Skills</span>
      </label>

      <div className="flex gap-2">
        <select
          className="select select-bordered select-sm"
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          <option value="">Select</option>
          {availableSkills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={addSkill} className="btn btn-sm">
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-1 mb-2">
        {skillIds.map((id) => {
          const skill = availableSkills.find((s) => s.id === id);
          return skill ? (
            <span key={id} className="badge badge-neutral badge-outline gap-1">
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(id)}
                className="text-black text-xs"
              >
                ✕
              </button>
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}
