import { TextEditor } from "@/components/TextEditor";
import { getUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
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

  return (
    <div className="flex flex-col h-full">
      <h1>Journal Detail</h1>

      <TextEditor entry={entry} />
    </div>
  );
}
