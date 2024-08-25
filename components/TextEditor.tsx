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
  const [isSaving, setIsSaving] = useState(false);

  const saveEntry = async () => {
    setIsSaving(true);
    await updateJournalAPI(entry.id, content);
    setIsSaving(false);
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
    <div className="relative mt-5 h-full">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded-lg resize-none h-full"
        placeholder="Write your thoughts here..."
      ></textarea>
    </div>
  );
}
