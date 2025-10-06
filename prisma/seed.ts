import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create skills
  const frontend = await prisma.skill.upsert({
    where: { name: "Frontend" },
    update: {},
    create: { name: "Frontend" },
  });

  const backend = await prisma.skill.upsert({
    where: { name: "Backend" },
    update: {},
    create: { name: "Backend" },
  });

  const alice = await prisma.developer.upsert({
    where: { name: "Alice" },
    update: {},
    create: {
      name: "Alice",
      skills: {
        create: [{ skillId: frontend.id }],
      },
    },
  });

  const bob = await prisma.developer.upsert({
    where: { name: "Bob" },
    update: {},
    create: {
      name: "Bob",
      skills: {
        create: [{ skillId: backend.id }],
      },
    },
  });
  const carol = await prisma.developer.upsert({
    where: { name: "Carol" },
    update: {},
    create: {
      name: "Carol",
      skills: {
        create: [{ skillId: frontend.id }, { skillId: backend.id }],
      },
    },
  });
  const dave = await prisma.developer.upsert({
    where: { name: "Dave" },
    update: {},
    create: {
      name: "Dave",
      skills: {
        create: [{ skillId: backend.id }],
      },
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
