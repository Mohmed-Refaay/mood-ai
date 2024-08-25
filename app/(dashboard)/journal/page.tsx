import { CreateNewEntry } from "@/components/CreateNewEntry";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import Link from "next/link";

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
          <Link href={`/journal/${journal.id}`}>
            <li
              key={journal.id}
              className="bg-white p-4 rounded-xl drop-shadow-md"
            >
              <dl>
                <div className="flex gap-4">
                  <dt>Date:</dt>
                  <dd>
                    {new Date(journal.createdAt).toDateString()}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt>Summary:</dt>
                  <dd className="text-nowrap overflow-hidden text-ellipsis">
                    {journal.content}
                  </dd>
                </div>
              </dl>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
