import { prisma } from "@/lib/prisma";

export async function getAllSkills() {
  return await prisma.skill.findMany();
}
