import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const developers = await prisma.developer.findMany({
      include: { skills: { include: { skill: true } } },
    });
    return NextResponse.json(developers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch developers" }, { status: 500 });
  }
}
