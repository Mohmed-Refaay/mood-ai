import { NextRequest, NextResponse } from "next/server";
import { qa } from "@/utils/ai";
import { prisma } from "@/utils/db";
import { getUser } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const { question } = await request.json();
  const user = await getUser();

  const entries = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const result = await qa(question, entries);

  return NextResponse.json({ answer: result });
}
