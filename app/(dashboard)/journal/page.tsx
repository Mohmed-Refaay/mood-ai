import { CreateNewEntry } from "@/components/CreateNewEntry";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { Button } from "@mui/joy";

async function getJournals() {
  const user = await getUser();

  const response = await prisma.journal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return response;
}

export default async function JournalPage() {
  const journals = await getJournals();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Journals</h1>
        <CreateNewEntry />
      </div>

      <ul className="grid grid-cols-3 gap-3">
        {journals.map((journal) => (
          <li key={journal.id}>{journal.content}</li>
        ))}
      </ul>
    </div>
  );
}
