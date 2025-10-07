type TaskSkill = {
  id: number;
  name: string;
};

type TaskSkillProps = {
  skills: Array<{ skill: TaskSkill }>;
};

export default function TaskSkill({ skills }: TaskSkillProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {skills.map(ts => (
        <span key={ts.skill.id}>
          {ts.skill.name}
        </span>
      ))}
    </div>
  );
}