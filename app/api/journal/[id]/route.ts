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

  return Response.json(journal);
}
