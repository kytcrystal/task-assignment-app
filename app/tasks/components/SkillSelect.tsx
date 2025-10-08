import { useState } from "react";

interface SkillSelectProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
}

export default function SkillSelect({ skills, setSkills }: SkillSelectProps) {
  const [skillInput, setSkillInput] = useState("Frontend");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, skillInput]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s: string) => s !== skill));
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Skills</span>
      </label>

      <div className="flex gap-2">
        <select
          className="select select-bordered select-sm"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
        </select>
        <button type="button" onClick={addSkill} className="btn btn-sm">
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-1 mb-2">
        {skills.map((s: string) => (
          <span key={s} className="badge badge-neutral badge-outline gap-1">
            {s}
            <button
              type="button"
              onClick={() => removeSkill(s)}
              className="text-black text-xs"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
