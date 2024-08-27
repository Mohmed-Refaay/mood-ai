import { analyze } from "@/utils/ai";
import { prisma } from "@/utils/db";

export async function PATCH(
  req: Request,
  { params: { id } }: { params: { id: string } },
) {
  const { content } = await req.json();

  const journal = await prisma.journal.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });

  const analysis = await analyze(content);

  if (analysis.mood !== "unknown") {
    await prisma.analysis.update({
      where: {
        journalId: journal.id,
      },
      data: {
        ...analysis,
      },
    });
  }

  return Response.json(journal);
}
