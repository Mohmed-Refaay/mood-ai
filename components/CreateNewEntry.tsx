"use client";

import { createJournalAPI } from "@/utils/api";
import { Button, IconButton, Modal } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateNewEntry() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createJournal = async () => {
    setIsLoading(true);
    await createJournalAPI(content);
    router.refresh();

    // Reset the state
    setIsLoading(false);
    setIsOpen(false);
    setContent("");
  };

  return (
    <div>
      <IconButton
        onClick={() => setIsOpen(true)}
        aria-label="Create new entry"
        variant="solid"
        color="primary"
      >
        +
      </IconButton>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex items-center justify-center w-screen h-screen">
          <div className="p-5 bg-white rounded-lg w-full mx-5 max-w-96">
            <h1 className="text-2xl mb-5">Create new entry</h1>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 border p-2 rounded-lg"
              placeholder="Write your thoughts here..."
            ></textarea>
            <div className="flex justify-end gap-2 mt-5">
              <Button
                variant="outlined"
                className="btn"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="btn btn-primary"
                onClick={createJournal}
                loading={isLoading}
              >
                {" "}
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
