import { TextEditor } from "@/components/TextEditor";
import { analyze } from "@/utils/ai";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { PrismaModels } from "@/utils/types";
import { Button } from "@mui/joy";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const deleteEntry = async (formData: FormData) => {
  "use server";
  const id = formData.get("id") as string;

  await prisma.journal.delete({ where: { id } });

  revalidatePath("/journal");

  redirect("/journal");
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
        <div className="flex items-center justify-between">
          <h1>Journal Detail</h1>

          <form action={deleteEntry}>
            <input type="hidden" name="id" value={entry.id} />
            <Button color="danger" type="submit">
              Delete
            </Button>
          </form>
        </div>

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
            <li
              key={detail}
              className="flex gap-2"
              style={{
                color: analysis.color,
                filter: "invert(1) grayscale(1) brightness(1.3) contrast(9000)",
                mixBlendMode: "luminosity",
                opacity: 0.9,
              }}
            >
              <dt className="capitalize">{detail}:</dt>
              <dd className="capitalize">{analysis[detail].toString()}</dd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
