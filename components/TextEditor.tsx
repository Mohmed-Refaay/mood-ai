"use client";
import { updateJournalAPI } from "@/utils/api";
import { PrismaModels } from "@/utils/types";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export function TextEditor({
  entry,
}: {
  entry: PrismaModels["Journal"];
}) {
  const router = useRouter();
  const [content, setContent] = useState(entry.content);

  const saveEntry = async () => {
    console.log("saving entry", entry.id);
    await updateJournalAPI(entry.id, content);
    router.refresh();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveEntry();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [content]);

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 border p-2 rounded-lg"
        placeholder="Write your thoughts here..."
      ></textarea>
    </div>
  );
}
