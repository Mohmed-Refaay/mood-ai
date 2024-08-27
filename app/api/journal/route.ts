import { analyze } from "@/utils/ai";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";

export async function POST(req: Request) {
  const { content } = await req.json();
  const user = await getUser();

  const journal = await prisma.journal.create({
    data: {
      content,
      userId: user.id,
    },
  });

  const analysis = await analyze(content);

  if (analysis.mood !== "unknown") {
    await prisma.analysis.create({
      data: {
        ...analysis,
        journalId: journal.id,
      },
    });
  }

  return Response.json(journal);
}
