import { TextEditor } from "@/components/TextEditor";
import { analyze } from "@/utils/ai";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { PrismaModels } from "@/utils/types";
import { Button } from "@mui/joy";
import Link from "next/link";

const getEntry = async (id: string) => {
  const user = await getUser();

  const entry = await prisma.journal.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  return entry;
};

const addOrGetAnalysis = async (journal: PrismaModels["Journal"]) => {
  const has = await prisma.analysis.findUnique({
    where: {
      journalId: journal.id,
    },
  });

  if (has) {
    return has;
  }

  const analysis = await analyze(journal.content);

  return await prisma.analysis.create({
    data: {
      ...analysis,
      journalId: journal.id,
    },
  });
};

export default async function JournalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const entry = await getEntry(params.id);

  if (!entry) {
    return (
      <div className="flex gap-5 justify-center items-center w-full h-full flex-col">
        <h1 className="text-3xl">Entry not found</h1>
        <Link href="/journal">
          <Button variant="soft" color="danger">
            Back to journal
          </Button>
        </Link>
      </div>
    );
  }

  const details = ["summary", "mood", "negative"] as const;

  const analysis = await addOrGetAnalysis(entry);

  return (
    <div className="flex h-full gap-3">
      <div className="flex-[0.7] flex flex-col">
        <h1>Journal Detail</h1>

        <TextEditor entry={entry} />
      </div>
      <div className="flex-[0.3]">
        <h1>Analysis</h1>

        <ul
          className="bg-white mt-5 p-5 rounded-lg"
          style={{
            background: analysis.color,
          }}
        >
          {details.map((detail) => (
            <li key={detail} className="flex gap-2">
              <dt className="capitalize">{detail}:</dt>
              <dd className="capitalize">{analysis[detail].toString()}</dd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
