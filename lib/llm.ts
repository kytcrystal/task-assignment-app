import { getAllSkills } from "@/lib/skills";
import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function detectSkillsFromTitle(title: string): Promise<number[]> {
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set");
    return Promise.resolve([]);
  }

  try {
    console.log(`Asking Gemini AI to analyze: "${title}"`);

    const skills = await getAllSkills();
    const skillNames = skills.map((s) => `- ${s.name}`).join("\n");
    const prompt = `You are a technical project manager analyzing software development tasks.

Task: "${title}"

Available Skills:
${skillNames}

Instructions:
- Analyze what technical skills are needed for this task`;

    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
      responseMimeType: "text/x.enum",
      responseSchema: {
        type: Type.STRING,
        enum: ["Frontend", "Backend", "Both"],
      },
    },
    });
    const result = response.text?.trim().toLowerCase();
    console.log("Gemini API response:", result);

    if (result?.includes("both")) {
      console.log(
        "Detected skills: All skills",
        skills.map((s) => s.id)
      );
      return skills.map((s) => s.id); 
    }
    for (const skill of skills) {
      if (result?.includes(skill.name.toLowerCase())) {
        console.log(`Detected skills: ${skill.name} [${skill.id}]`);
        return [skill.id];
      }
    }
    console.log(`Detected skills: Default [${skills[0]?.id}]`);
    return skills[0] ? [skills[0].id] : [];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return Promise.resolve([]);
  }
}
